package com.parksensex.backend.controllers;

import com.parksensex.backend.dto.BookingDto;
import com.parksensex.backend.dto.FacilityDto;
import com.parksensex.backend.models.Booking;
import com.parksensex.backend.models.ParkingSlot;
import com.parksensex.backend.models.User;
import com.parksensex.backend.repositories.BookingRepository;
import com.parksensex.backend.repositories.ParkingFacilityRepository;
import com.parksensex.backend.repositories.ParkingSlotRepository;
import com.parksensex.backend.services.BookingService;
import com.parksensex.backend.services.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Operator-only endpoints for facility management, reservations, and gate control.
 */
@RestController
@RequestMapping("/api/operator")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
public class OperatorController {

    private final FacilityService facilityService;
    private final BookingService bookingService;
    private final ParkingFacilityRepository facilityRepo;
    private final BookingRepository bookingRepo;
    private final ParkingSlotRepository slotRepo;
    private final SimpMessagingTemplate messaging;

    @GetMapping("/facilities")
    public ResponseEntity<List<FacilityDto>> myFacilities(@AuthenticationPrincipal User user) {
        var facilities = facilityRepo.findByOperator(user);
        if (facilities.isEmpty()) {
            facilities = facilityRepo.findByStatus(com.parksensex.backend.models.ParkingFacility.Status.ACTIVE);
        }
        return ResponseEntity.ok(facilities.stream().map(facilityService::toDto).collect(Collectors.toList()));
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<BookingDto.Response>> getAllReservations() {
        return ResponseEntity.ok(
            bookingRepo.findAll().stream().map(bookingService::toDto).collect(Collectors.toList()));
    }

    @GetMapping("/reservations/{facilityId}")
    public ResponseEntity<List<BookingDto.Response>> getFacilityReservations(
            @PathVariable Long facilityId) {
        return ResponseEntity.ok(
            bookingRepo.findByFacilityIdAndStatusIn(facilityId,
                List.of(Booking.BookingStatus.CONFIRMED, Booking.BookingStatus.ACTIVE))
            .stream().map(bookingService::toDto).collect(Collectors.toList()));
    }

    @PostMapping("/checkin/{bookingId}")
    public ResponseEntity<BookingDto.Response> operatorCheckIn(@PathVariable Long bookingId) {
        var booking = bookingRepo.findById(bookingId)
            .orElseThrow(() -> new com.parksensex.backend.exceptions.ApiException(
                "Booking not found", org.springframework.http.HttpStatus.NOT_FOUND));
        booking.setStatus(Booking.BookingStatus.ACTIVE);
        booking.setCheckInTime(LocalDateTime.now());
        booking.getSlot().setStatus(ParkingSlot.SlotStatus.OCCUPIED);
        slotRepo.save(booking.getSlot());
        bookingRepo.save(booking);
        broadcastUpdate(booking, "RESERVED", "OCCUPIED");
        return ResponseEntity.ok(bookingService.toDto(booking));
    }

    @PostMapping("/checkout/{bookingId}")
    public ResponseEntity<BookingDto.Response> operatorCheckOut(@PathVariable Long bookingId) {
        var booking = bookingRepo.findById(bookingId)
            .orElseThrow(() -> new com.parksensex.backend.exceptions.ApiException(
                "Booking not found", org.springframework.http.HttpStatus.NOT_FOUND));
        booking.setStatus(Booking.BookingStatus.COMPLETED);
        booking.setCheckOutTime(LocalDateTime.now());
        booking.getSlot().setStatus(ParkingSlot.SlotStatus.AVAILABLE);
        slotRepo.save(booking.getSlot());
        bookingRepo.save(booking);
        broadcastUpdate(booking, "OCCUPIED", "AVAILABLE");
        return ResponseEntity.ok(bookingService.toDto(booking));
    }

    @PostMapping("/noshow/{bookingId}")
    public ResponseEntity<BookingDto.Response> markNoShow(@PathVariable Long bookingId) {
        var booking = bookingRepo.findById(bookingId)
            .orElseThrow(() -> new com.parksensex.backend.exceptions.ApiException(
                "Booking not found", org.springframework.http.HttpStatus.NOT_FOUND));
        booking.setStatus(Booking.BookingStatus.NO_SHOW);
        booking.getSlot().setStatus(ParkingSlot.SlotStatus.AVAILABLE);
        slotRepo.save(booking.getSlot());
        bookingRepo.save(booking);
        broadcastUpdate(booking, "RESERVED", "AVAILABLE");
        return ResponseEntity.ok(bookingService.toDto(booking));
    }

    @GetMapping("/analytics/{facilityId}")
    public ResponseEntity<Map<String, Object>> getAnalytics(@PathVariable Long facilityId) {
        var facility = facilityRepo.findById(facilityId)
            .orElseThrow(() -> new com.parksensex.backend.exceptions.ApiException(
                "Facility not found", org.springframework.http.HttpStatus.NOT_FOUND));

        long totalBookings  = bookingRepo.countActiveBookingsByFacility(facilityId);
        var allBookings     = bookingRepo.findByFacilityIdAndStatusIn(facilityId,
            List.of(Booking.BookingStatus.CONFIRMED, Booking.BookingStatus.ACTIVE,
                    Booking.BookingStatus.COMPLETED, Booking.BookingStatus.NO_SHOW,
                    Booking.BookingStatus.CANCELLED));

        long completed  = allBookings.stream().filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED).count();
        long noShows    = allBookings.stream().filter(b -> b.getStatus() == Booking.BookingStatus.NO_SHOW).count();
        long cancelled  = allBookings.stream().filter(b -> b.getStatus() == Booking.BookingStatus.CANCELLED).count();

        double totalRevenue = allBookings.stream()
            .filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED)
            .mapToDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount().doubleValue() : 0)
            .sum();

        double noShowRate = allBookings.isEmpty() ? 0 :
            Math.round((double) noShows / allBookings.size() * 100 * 10) / 10.0;

        Map<String, Object> result = new HashMap<>();
        result.put("facilityId", facilityId);
        result.put("facilityName", facility.getName());
        result.put("totalBookings", allBookings.size());
        result.put("activeBookings", totalBookings);
        result.put("completedBookings", completed);
        result.put("noShows", noShows);
        result.put("cancellations", cancelled);
        result.put("totalRevenue", Math.round(totalRevenue * 100) / 100.0);
        result.put("noShowRate", noShowRate);
        result.put("dataSource", "REAL");

        return ResponseEntity.ok(result);
    }

    private void broadcastUpdate(Booking b, String prev, String next) {
        try {
            Map<String, Object> msg = new HashMap<>();
            msg.put("slotId", b.getSlot().getId());
            msg.put("slotCode", b.getSlot().getSlotCode());
            msg.put("facilityId", b.getFacility().getId());
            msg.put("previousStatus", prev);
            msg.put("newStatus", next);
            msg.put("timestamp", LocalDateTime.now().toString());
            msg.put("source", "OPERATOR");
            messaging.convertAndSend("/topic/slots/" + b.getFacility().getId(), msg);
        } catch (Exception ignored) {}
    }
}
