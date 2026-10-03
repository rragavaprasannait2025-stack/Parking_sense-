package com.parksensex.backend.controllers;

import com.parksensex.backend.dto.BookingDto;
import com.parksensex.backend.models.User;
import com.parksensex.backend.services.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Booking CRUD + lifecycle endpoints.
 * All endpoints require a valid JWT.
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDto.Response> create(
            @Valid @RequestBody BookingDto.CreateRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(bookingService.createBooking(req, user.getId()));
    }

    @GetMapping
    public ResponseEntity<List<BookingDto.Response>> getMyBookings(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getMyBookings(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDto.Response> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getBookingById(id, user.getId()));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingDto.Response> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, user.getId()));
    }

    @PostMapping("/checkin")
    public ResponseEntity<BookingDto.Response> checkIn(
            @Valid @RequestBody BookingDto.CheckInRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.checkIn(req.getBookingRef(), user.getId()));
    }
}
