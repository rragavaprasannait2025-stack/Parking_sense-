package com.parksensex.backend.services;

import com.parksensex.backend.dto.FacilityDto;
import com.parksensex.backend.exceptions.ApiException;
import com.parksensex.backend.models.*;
import com.parksensex.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Handles parking facility queries with real-time computed stats.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FacilityService {

    private final ParkingFacilityRepository facilityRepo;
    private final ParkingSlotRepository slotRepo;

    public List<FacilityDto> getAllActive() {
        return facilityRepo.findByStatus(ParkingFacility.Status.ACTIVE)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public FacilityDto getById(Long id) {
        var facility = facilityRepo.findById(id)
            .orElseThrow(() -> new ApiException("Facility not found: " + id, HttpStatus.NOT_FOUND));
        return toDto(facility);
    }

    public List<FacilityDto> getNearby(double lat, double lng, double radiusKm) {
        return facilityRepo.findNearby(lat, lng, radiusKm)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    // ─── Mapping ──────────────────────────────────────────────────────────────

    public FacilityDto toDto(ParkingFacility f) {
        var dto = new FacilityDto();
        dto.setId(f.getId());
        dto.setName(f.getName());
        dto.setAddress(f.getAddress());
        dto.setCity(f.getCity());
        dto.setLatitude(f.getLatitude());
        dto.setLongitude(f.getLongitude());
        dto.setTotalSlots(f.getTotalSlots());
        dto.setStatus(f.getStatus().name());
        dto.setPricePerHour(f.getPricePerHour());
        dto.setCurrency(f.getCurrency());
        dto.setCreatedAt(f.getCreatedAt() != null ? f.getCreatedAt().toString() : null);

        if (f.getOperator() != null) {
            dto.setOperatorId(f.getOperator().getId());
            dto.setOperatorName(f.getOperator().getName());
        }

        // Compute live slot stats
        long available    = slotRepo.countAvailableByFacility(f);
        long occupied     = slotRepo.countOccupiedByFacility(f);
        int totalNonMaint = Math.max(1, f.getTotalSlots());

        dto.setAvailableSlots((int) available);
        dto.setOccupiedSlots((int) occupied);
        dto.setReservedSlots((int) Math.max(0, f.getTotalSlots() - available - occupied));
        dto.setMaintenanceSlots(0);

        double occupancyRate = f.getTotalSlots() > 0
            ? Math.round(((double) occupied / f.getTotalSlots()) * 100.0 * 10) / 10.0
            : 0.0;
        dto.setOccupancyRate(occupancyRate);

        // Congestion level based on occupancy
        dto.setCongestionLevel(computeCongestion(occupancyRate));
        dto.setCarbonScore(computeCarbonScore(f));

        // Placeholder amenities (extend when amenities table is added)
        dto.setAmenities(List.of("EV_CHARGING", "COVERED", "CCTV", "SECURITY"));

        // Floors → Zones → Slots
        if (f.getFloors() != null) {
            dto.setFloors(f.getFloors().stream().map(fl -> {
                var flDto = new FacilityDto.FloorDto();
                flDto.setId(fl.getId());
                flDto.setLevel(fl.getLevel());
                flDto.setName(fl.getName());

                if (fl.getZones() != null) {
                    flDto.setZones(fl.getZones().stream().map(z -> {
                        var zDto = new FacilityDto.ZoneDto();
                        zDto.setId(z.getId());
                        zDto.setName(z.getName());
                        zDto.setType(z.getType().name());
                        zDto.setPriceMultiplier(z.getPriceMultiplier());

                        if (z.getSlots() != null) {
                            var slotDtos = z.getSlots().stream().map(s -> {
                                var sDto = new FacilityDto.SlotDto();
                                sDto.setId(s.getId());
                                sDto.setSlotCode(s.getSlotCode());
                                sDto.setStatus(s.getStatus().name());
                                sDto.setType(s.getType().name());
                                sDto.setFloor(fl.getLevel());
                                sDto.setZone(z.getName());
                                sDto.setPricePerHour(s.getPricePerHour());
                                sDto.setHasEvCharger(s.getHasEvCharger());
                                sDto.setIsAccessible(s.getIsAccessible());
                                sDto.setIsCovered(s.getIsCovered());
                                sDto.setNearEntrance(s.getNearEntrance());
                                sDto.setNearElevator(s.getNearElevator());
                                sDto.setLastUpdated(s.getLastUpdated() != null ? s.getLastUpdated().toString() : null);
                                return sDto;
                            }).collect(Collectors.toList());

                            zDto.setSlots(slotDtos);
                            zDto.setTotalSlots(slotDtos.size());
                            zDto.setAvailableSlots((int) slotDtos.stream().filter(s -> "AVAILABLE".equals(s.getStatus())).count());
                        }
                        return zDto;
                    }).collect(Collectors.toList()));

                    int flTotal = flDto.getZones().stream().mapToInt(FacilityDto.ZoneDto::getTotalSlots).sum();
                    int flAvail = flDto.getZones().stream().mapToInt(FacilityDto.ZoneDto::getAvailableSlots).sum();
                    flDto.setTotalSlots(flTotal);
                    flDto.setAvailableSlots(flAvail);
                }
                return flDto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }

    private String computeCongestion(double occupancyRate) {
        if (occupancyRate >= 90) return "CRITICAL";
        if (occupancyRate >= 75) return "HIGH";
        if (occupancyRate >= 55) return "MEDIUM";
        return "LOW";
    }

    private int computeCarbonScore(ParkingFacility f) {
        // Simple heuristic: covered/EV-equipped facilities score higher
        return 75; // base score; extend with real amenity data
    }
}
