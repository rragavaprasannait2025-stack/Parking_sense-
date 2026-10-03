package com.parksensex.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Booking entity — represents a parking reservation with full lifecycle.
 */
@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_booking_user",   columnList = "user_id"),
    @Index(name = "idx_booking_slot",   columnList = "slot_id"),
    @Index(name = "idx_booking_ref",    columnList = "booking_ref", unique = true),
    @Index(name = "idx_booking_status", columnList = "status"),
})
@Data
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String bookingRef;      // e.g. "PX2048"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id", nullable = false)
    private ParkingFacility facility;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private ParkingSlot slot;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(length = 3)
    private String currency = "INR";

    private Double noShowProbability;

    @Column(columnDefinition = "TEXT")
    private String qrData;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime cancelledAt;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;

    @Column(precision = 6, scale = 3)
    private Double carbonKg;

    public enum BookingStatus {
        PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED, NO_SHOW, EXPIRED
    }
}
