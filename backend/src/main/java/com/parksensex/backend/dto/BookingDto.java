package com.parksensex.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class BookingDto {

    /** Request: create a new booking */
    @Data
    public static class CreateRequest {
        @NotNull
        private Long facilityId;

        private Long slotId;              // optional — AI picks if null

        @NotNull
        @Future
        private LocalDateTime startTime;

        @NotNull
        @Future
        private LocalDateTime endTime;

        private String optimizationMode; // balanced, cheapest, closest, greenest
        private Boolean requireEv;
        private Boolean requireAccessible;
    }

    /** Response: booking summary */
    @Data
    public static class Response {
        private Long id;
        private String bookingRef;
        private Long userId;
        private Long facilityId;
        private String facilityName;
        private Long slotId;
        private String slotCode;
        private Integer floor;
        private String zone;
        private String startTime;
        private String endTime;
        private Integer durationMinutes;
        private String status;
        private Double totalAmount;
        private String currency;
        private Double noShowProbability;
        private String qrData;
        private Double carbonKg;
        private String createdAt;
        private String checkInTime;
        private String checkOutTime;
    }

    /** Request: check-in */
    @Data
    public static class CheckInRequest {
        @NotNull
        private String bookingRef;
    }
}
