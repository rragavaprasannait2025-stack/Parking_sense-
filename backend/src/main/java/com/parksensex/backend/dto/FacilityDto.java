package com.parksensex.backend.dto;

import com.parksensex.backend.models.ParkingFacility;
import lombok.Data;

import java.util.List;

/**
 * Full facility DTO including computed occupancy stats and floor/zone/slot structure.
 */
@Data
public class FacilityDto {

    private Long id;
    private String name;
    private String address;
    private String city;
    private Double latitude;
    private Double longitude;
    private Integer totalSlots;
    private Integer availableSlots;
    private Integer reservedSlots;
    private Integer occupiedSlots;
    private Integer maintenanceSlots;
    private Double occupancyRate;
    private String status;
    private Integer pricePerHour;
    private String currency;
    private Long operatorId;
    private String operatorName;
    private List<FloorDto> floors;
    private List<String> amenities;
    private String congestionLevel;
    private Integer carbonScore;
    private String createdAt;

    @Data
    public static class FloorDto {
        private Long id;
        private Integer level;
        private String name;
        private Integer totalSlots;
        private Integer availableSlots;
        private List<ZoneDto> zones;
    }

    @Data
    public static class ZoneDto {
        private Long id;
        private String name;
        private String type;
        private Integer totalSlots;
        private Integer availableSlots;
        private Double priceMultiplier;
        private List<SlotDto> slots;
    }

    @Data
    public static class SlotDto {
        private Long id;
        private String slotCode;
        private String status;
        private String type;
        private Integer floor;
        private String zone;
        private Integer pricePerHour;
        private Boolean hasEvCharger;
        private Boolean isAccessible;
        private Boolean isCovered;
        private Boolean nearEntrance;
        private Boolean nearElevator;
        private String lastUpdated;
    }
}
