package com.parksensex.backend.dto;

import lombok.Data;
import java.util.List;

/**
 * DTOs for ML prediction requests and responses (frontend ↔ Spring Boot ↔ FastAPI).
 */
public class PredictionDto {

    @Data
    public static class DemandRequest {
        private Long facilityId;
        private Integer horizonMinutes;
        private Double currentOccupancy;
    }

    @Data
    public static class DemandResponse {
        private Long facilityId;
        private Integer horizonMinutes;
        private Double predictedOccupancy;
        private Double confidence;
        private Boolean isPeakPeriod;
        private String dataSource;
        private String modelUsed;
        private String timestamp;
    }

    @Data
    public static class NoShowRequest {
        private Long bookingId;
        private Long userId;
        private Long facilityId;
        private Double bookingLeadHours;
        private Integer durationMinutes;
        private Double userHistoricalNoshowRate;
        private Integer userCancellationCount;
    }

    @Data
    public static class NoShowResponse {
        private Long bookingId;
        private Double probability;
        private String riskLevel;
        private List<FactorDto> factors;
        private String dataSource;
    }

    @Data
    public static class FactorDto {
        private String name;
        private String impact;
        private Double weight;
        private String description;
    }

    @Data
    public static class RecommendationRequest {
        private Long facilityId;
        private String userPreference;
        private List<SlotCandidateDto> candidates;
        private Double maxPrice;
        private Boolean requireEv;
        private Boolean requireAccessible;
    }

    @Data
    public static class SlotCandidateDto {
        private Long slotId;
        private String slotCode;
        private Integer floor;
        private String zone;
        private Double pricePerHour;
        private Double distanceToEntrance;
        private Boolean hasEvCharger;
        private Boolean isAccessible;
        private Boolean isCovered;
        private Boolean nearElevator;
        private String currentStatus;
    }

    @Data
    public static class ScoredSlotDto {
        private Long slotId;
        private String slotCode;
        private Double suitabilityScore;
        private java.util.Map<String, Double> factorScores;
        private String explanation;
        private String dataSource;
    }

    @Data
    public static class HealthResponse {
        private String status;
        private String service;
        private String version;
    }
}
