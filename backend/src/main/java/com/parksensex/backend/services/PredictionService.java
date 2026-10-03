package com.parksensex.backend.services;

import com.parksensex.backend.dto.FacilityDto;
import com.parksensex.backend.dto.PredictionDto;
import com.parksensex.backend.exceptions.ApiException;
import com.parksensex.backend.models.OccupancyHistory;
import com.parksensex.backend.repositories.OccupancyHistoryRepository;
import com.parksensex.backend.repositories.ParkingFacilityRepository;
import com.parksensex.backend.repositories.ParkingSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Orchestrates prediction requests: fetches current occupancy,
 * calls ML service, persists predictions, returns results.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PredictionService {

    private final MlServiceClient mlClient;
    private final ParkingFacilityRepository facilityRepo;
    private final ParkingSlotRepository slotRepo;
    private final OccupancyHistoryRepository occupancyHistRepo;
    private final FacilityService facilityService;

    // ─── Demand Forecast ─────────────────────────────────────────────────────

    public List<PredictionDto.DemandResponse> forecastDemand(Long facilityId) {
        var facility = facilityRepo.findById(facilityId)
            .orElseThrow(() -> new ApiException("Facility not found", HttpStatus.NOT_FOUND));

        double currentOccupancy = facilityService.toDto(facility).getOccupancyRate();
        List<PredictionDto.DemandResponse> results = new ArrayList<>();

        for (int horizon : new int[]{15, 30, 60, 180}) {
            var req = new PredictionDto.DemandRequest();
            req.setFacilityId(facilityId);
            req.setHorizonMinutes(horizon);
            req.setCurrentOccupancy(currentOccupancy);

            var response = mlClient.predictDemand(req);
            response.ifPresent(results::add);

            if (response.isEmpty()) {
                // Graceful fallback
                var fallback = new PredictionDto.DemandResponse();
                fallback.setFacilityId(facilityId);
                fallback.setHorizonMinutes(horizon);
                fallback.setPredictedOccupancy(Math.min(100.0, currentOccupancy + horizon * 0.05));
                fallback.setConfidence(60.0);
                fallback.setIsPeakPeriod(false);
                fallback.setDataSource("FALLBACK");
                fallback.setModelUsed("Heuristic fallback");
                fallback.setTimestamp(LocalDateTime.now().plusMinutes(horizon).toString());
                results.add(fallback);
            }
        }
        return results;
    }

    // ─── Slot Recommendations ─────────────────────────────────────────────────

    public List<PredictionDto.ScoredSlotDto> recommendSlots(
            Long facilityId, String preference, boolean requireEv, boolean requireAccessible) {

        var slots = slotRepo.findAvailableByFacilityId(facilityId);
        if (slots.isEmpty()) return List.of();

        var facility = facilityRepo.findById(facilityId)
            .orElseThrow(() -> new ApiException("Facility not found", HttpStatus.NOT_FOUND));
        var facilityDto = facilityService.toDto(facility);

        // Build candidate list
        var candidates = slots.stream().map(s -> {
            var c = new PredictionDto.SlotCandidateDto();
            c.setSlotId(s.getId());
            c.setSlotCode(s.getSlotCode());
            c.setFloor(s.getZone() != null ? s.getZone().getFloor().getLevel() : 1);
            c.setZone(s.getZone() != null ? s.getZone().getName() : "");
            c.setPricePerHour(s.getPricePerHour() != null ? s.getPricePerHour().doubleValue() : 60.0);
            c.setDistanceToEntrance(s.getNearEntrance() != null && s.getNearEntrance() ? 30.0 : 150.0);
            c.setHasEvCharger(Boolean.TRUE.equals(s.getHasEvCharger()));
            c.setIsAccessible(Boolean.TRUE.equals(s.getIsAccessible()));
            c.setIsCovered(Boolean.TRUE.equals(s.getIsCovered()));
            c.setNearElevator(Boolean.TRUE.equals(s.getNearElevator()));
            c.setCurrentStatus(s.getStatus().name());
            return c;
        }).toList();

        var req = new PredictionDto.RecommendationRequest();
        req.setFacilityId(facilityId);
        req.setUserPreference(preference != null ? preference : "balanced");
        req.setCandidates(candidates);
        req.setRequireEv(requireEv);
        req.setRequireAccessible(requireAccessible);

        var results = mlClient.recommendSlots(req);
        if (results.isEmpty()) {
            // Fallback: return first available slot with basic scoring
            return candidates.stream().limit(3).map(c -> {
                var s = new PredictionDto.ScoredSlotDto();
                s.setSlotId(c.getSlotId());
                s.setSlotCode(c.getSlotCode());
                s.setSuitabilityScore(70.0);
                s.setFactorScores(java.util.Map.of(
                    "availability", 85.0, "distance", 70.0,
                    "price", 75.0, "congestion", 70.0));
                s.setExplanation("ML service unavailable — showing first available slot.");
                s.setDataSource("FALLBACK");
                return s;
            }).toList();
        }
        return results;
    }

    // ─── Occupancy history snapshot (scheduled every 5 min) ──────────────────

    @Scheduled(fixedDelay = 300_000)
    @Transactional
    public void recordOccupancySnapshot() {
        facilityRepo.findByStatus(com.parksensex.backend.models.ParkingFacility.Status.ACTIVE)
            .forEach(f -> {
                try {
                    long avail = slotRepo.countAvailableByFacility(f);
                    long occ   = slotRepo.countOccupiedByFacility(f);
                    double rate = f.getTotalSlots() > 0
                        ? (double) occ / f.getTotalSlots() * 100.0 : 0.0;

                    var h = new OccupancyHistory();
                    h.setFacility(f);
                    h.setOccupancyRate(Math.round(rate * 10) / 10.0);
                    h.setAvailableSlots((int) avail);
                    h.setRecordedAt(LocalDateTime.now());
                    h.setSource(OccupancyHistory.Source.SENSOR);
                    occupancyHistRepo.save(h);
                } catch (Exception e) {
                    log.warn("Failed to record occupancy for facility {}: {}", f.getId(), e.getMessage());
                }
            });
    }

    public List<OccupancyHistory> getOccupancyHistory(Long facilityId, int hours) {
        var from = LocalDateTime.now().minusHours(hours);
        return occupancyHistRepo.findByFacilityIdAndRecordedAtAfterOrderByRecordedAtAsc(facilityId, from);
    }
}
