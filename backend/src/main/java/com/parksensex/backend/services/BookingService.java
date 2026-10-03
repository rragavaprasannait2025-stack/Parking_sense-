package com.parksensex.backend.services;

import com.parksensex.backend.dto.BookingDto;
import com.parksensex.backend.dto.PredictionDto;
import com.parksensex.backend.exceptions.ApiException;
import com.parksensex.backend.models.*;
import com.parksensex.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

/**
 * Handles the complete booking lifecycle with real ML no-show scoring.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepo;
    private final ParkingFacilityRepository facilityRepo;
    private final ParkingSlotRepository slotRepo;
    private final UserRepository userRepo;
    private final MlServiceClient mlClient;
    private final SimpMessagingTemplate messagingTemplate;

    private static final Random RNG = new Random();

    // ─── Create Booking ───────────────────────────────────────────────────────

    @Transactional
    public BookingDto.Response createBooking(BookingDto.CreateRequest req, Long userId) {
        var user = userRepo.findById(userId)
            .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        var facility = facilityRepo.findById(req.getFacilityId())
            .orElseThrow(() -> new ApiException("Facility not found", HttpStatus.NOT_FOUND));

        if (facility.getStatus() != ParkingFacility.Status.ACTIVE) {
            throw new ApiException("Facility is not accepting bookings", HttpStatus.CONFLICT);
        }

        // Resolve slot
        ParkingSlot slot;
        if (req.getSlotId() != null) {
            slot = slotRepo.findById(req.getSlotId())
                .orElseThrow(() -> new ApiException("Slot not found", HttpStatus.NOT_FOUND));
            if (slot.getStatus() != ParkingSlot.SlotStatus.AVAILABLE) {
                throw new ApiException("Slot " + slot.getSlotCode() + " is no longer available", HttpStatus.CONFLICT);
            }
        } else {
            var available = slotRepo.findAvailableByFacilityId(facility.getId());
            if (available.isEmpty()) {
                throw new ApiException("No available slots in this facility", HttpStatus.CONFLICT);
            }
            slot = available.get(0); // simplest pick; ML recommends via separate endpoint
        }

        // Check for time conflict
        var conflicts = bookingRepo.findConflictingBookings(slot.getId(), req.getStartTime(), req.getEndTime());
        if (!conflicts.isEmpty()) {
            throw new ApiException("Slot has a conflicting booking", HttpStatus.CONFLICT);
        }

        long minutes = ChronoUnit.MINUTES.between(req.getStartTime(), req.getEndTime());
        if (minutes < 15 || minutes > 1440) {
            throw new ApiException("Booking duration must be 15 minutes to 24 hours", HttpStatus.BAD_REQUEST);
        }

        // Calculate amount
        double hours = minutes / 60.0;
        BigDecimal amount = BigDecimal.valueOf(slot.getPricePerHour() * hours)
            .setScale(2, RoundingMode.HALF_UP);

        // No-show prediction via ML service
        double noShowProb = getNoShowProbability(userId, facility.getId(), req, user);

        // Carbon estimate (avg 7L/100km, 2.31 kg CO2/L, ~1.2km approach)
        double carbonKg = 0.8;

        // Build booking
        var booking = new Booking();
        booking.setBookingRef(generateRef());
        booking.setUser(user);
        booking.setFacility(facility);
        booking.setSlot(slot);
        booking.setStartTime(req.getStartTime());
        booking.setEndTime(req.getEndTime());
        booking.setDurationMinutes((int) minutes);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking.setTotalAmount(amount);
        booking.setCurrency("INR");
        booking.setNoShowProbability(noShowProb);
        booking.setCarbonKg(carbonKg);
        booking.setQrData(buildQrData(booking.getBookingRef(), slot.getSlotCode(), facility.getId(), req.getStartTime()));

        booking = bookingRepo.save(booking);

        // Mark slot as reserved
        slot.setStatus(ParkingSlot.SlotStatus.RESERVED);
        slotRepo.save(slot);

        // Broadcast WebSocket slot update
        broadcastSlotUpdate(slot, facility.getId(), "AVAILABLE", "RESERVED");

        return toDto(booking);
    }

    // ─── Get User Bookings ────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<BookingDto.Response> getMyBookings(Long userId) {
        var user = userRepo.findById(userId)
            .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return bookingRepo.findByUserOrderByCreatedAtDesc(user)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingDto.Response getBookingById(Long id, Long userId) {
        var booking = bookingRepo.findById(id)
            .orElseThrow(() -> new ApiException("Booking not found", HttpStatus.NOT_FOUND));
        if (!booking.getUser().getId().equals(userId)) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }
        return toDto(booking);
    }

    // ─── Check-in (simulate gate entry) ──────────────────────────────────────

    @Transactional
    public BookingDto.Response checkIn(String bookingRef, Long userId) {
        var booking = bookingRepo.findByBookingRef(bookingRef)
            .orElseThrow(() -> new ApiException("Booking not found: " + bookingRef, HttpStatus.NOT_FOUND));
        if (!booking.getUser().getId().equals(userId)) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new ApiException("Cannot check in — booking status: " + booking.getStatus(), HttpStatus.CONFLICT);
        }
        booking.setStatus(Booking.BookingStatus.ACTIVE);
        booking.setCheckInTime(LocalDateTime.now());
        booking.getSlot().setStatus(ParkingSlot.SlotStatus.OCCUPIED);
        slotRepo.save(booking.getSlot());
        bookingRepo.save(booking);
        broadcastSlotUpdate(booking.getSlot(), booking.getFacility().getId(), "RESERVED", "OCCUPIED");
        return toDto(booking);
    }

    // ─── Cancel Booking ───────────────────────────────────────────────────────

    @Transactional
    public BookingDto.Response cancelBooking(Long bookingId, Long userId) {
        var booking = bookingRepo.findById(bookingId)
            .orElseThrow(() -> new ApiException("Booking not found", HttpStatus.NOT_FOUND));
        if (!booking.getUser().getId().equals(userId)) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED ||
            booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new ApiException("Cannot cancel a " + booking.getStatus() + " booking", HttpStatus.CONFLICT);
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        booking.getSlot().setStatus(ParkingSlot.SlotStatus.AVAILABLE);
        slotRepo.save(booking.getSlot());
        bookingRepo.save(booking);
        broadcastSlotUpdate(booking.getSlot(), booking.getFacility().getId(), "RESERVED", "AVAILABLE");
        return toDto(booking);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private double getNoShowProbability(Long userId, Long facilityId, BookingDto.CreateRequest req, User user) {
        var noShowReq = new PredictionDto.NoShowRequest();
        noShowReq.setBookingId(-1L); // new booking
        noShowReq.setUserId(userId);
        noShowReq.setFacilityId(facilityId);
        noShowReq.setDurationMinutes((int) ChronoUnit.MINUTES.between(req.getStartTime(), req.getEndTime()));
        noShowReq.setBookingLeadHours(
            (double) ChronoUnit.HOURS.between(LocalDateTime.now(), req.getStartTime()));
        noShowReq.setUserHistoricalNoshowRate(0.1); // default; extend with real user history
        noShowReq.setUserCancellationCount(0);

        return mlClient.predictNoShow(noShowReq)
            .map(PredictionDto.NoShowResponse::getProbability)
            .orElse(20.0);  // fallback
    }

    private String generateRef() {
        return "PX" + (1000 + RNG.nextInt(9000));
    }

    private String buildQrData(String ref, String slot, Long facilityId, LocalDateTime start) {
        return String.format("{\"ref\":\"%s\",\"slot\":\"%s\",\"facility\":%d,\"start\":\"%s\"}",
            ref, slot, facilityId, start);
    }

    private void broadcastSlotUpdate(ParkingSlot slot, Long facilityId,
                                      String prevStatus, String newStatus) {
        try {
            var update = new java.util.HashMap<String, Object>();
            update.put("slotId", slot.getId());
            update.put("slotCode", slot.getSlotCode());
            update.put("facilityId", facilityId);
            update.put("previousStatus", prevStatus);
            update.put("newStatus", newStatus);
            update.put("timestamp", LocalDateTime.now().toString());
            update.put("source", "BOOKING");
            messagingTemplate.convertAndSend("/topic/slots/" + facilityId, update);
        } catch (Exception e) {
            log.warn("WS broadcast failed: {}", e.getMessage());
        }
    }

    public BookingDto.Response toDto(Booking b) {
        var dto = new BookingDto.Response();
        dto.setId(b.getId());
        dto.setBookingRef(b.getBookingRef());
        dto.setUserId(b.getUser().getId());
        dto.setFacilityId(b.getFacility().getId());
        dto.setFacilityName(b.getFacility().getName());
        dto.setSlotId(b.getSlot().getId());
        dto.setSlotCode(b.getSlot().getSlotCode());
        dto.setFloor(b.getSlot().getZone() != null ? b.getSlot().getZone().getFloor().getLevel() : 1);
        dto.setZone(b.getSlot().getZone() != null ? b.getSlot().getZone().getName() : "");
        dto.setStartTime(b.getStartTime().toString());
        dto.setEndTime(b.getEndTime().toString());
        dto.setDurationMinutes(b.getDurationMinutes());
        dto.setStatus(b.getStatus().name());
        dto.setTotalAmount(b.getTotalAmount() != null ? b.getTotalAmount().doubleValue() : 0.0);
        dto.setCurrency(b.getCurrency());
        dto.setNoShowProbability(b.getNoShowProbability());
        dto.setQrData(b.getQrData());
        dto.setCarbonKg(b.getCarbonKg());
        dto.setCreatedAt(b.getCreatedAt().toString());
        if (b.getCheckInTime() != null) dto.setCheckInTime(b.getCheckInTime().toString());
        if (b.getCheckOutTime() != null) dto.setCheckOutTime(b.getCheckOutTime().toString());
        return dto;
    }
}
