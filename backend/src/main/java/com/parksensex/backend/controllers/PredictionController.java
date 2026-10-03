package com.parksensex.backend.controllers;

import com.parksensex.backend.dto.PredictionDto;
import com.parksensex.backend.models.OccupancyHistory;
import com.parksensex.backend.services.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ML prediction endpoints — demand forecast, no-show risk, slot recommendation.
 */
@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    /**
     * Demand forecast for a facility (calls FastAPI ML service).
     * GET /api/predictions/demand/{facilityId}
     */
    @GetMapping("/demand/{facilityId}")
    public ResponseEntity<List<PredictionDto.DemandResponse>> forecastDemand(
            @PathVariable Long facilityId) {
        return ResponseEntity.ok(predictionService.forecastDemand(facilityId));
    }

    /**
     * Slot recommendation for a facility.
     * GET /api/predictions/recommend/{facilityId}?preference=balanced&requireEv=false
     */
    @GetMapping("/recommend/{facilityId}")
    public ResponseEntity<List<PredictionDto.ScoredSlotDto>> recommendSlots(
            @PathVariable Long facilityId,
            @RequestParam(defaultValue = "balanced") String preference,
            @RequestParam(defaultValue = "false") boolean requireEv,
            @RequestParam(defaultValue = "false") boolean requireAccessible) {
        return ResponseEntity.ok(
            predictionService.recommendSlots(facilityId, preference, requireEv, requireAccessible));
    }

    /**
     * Occupancy history for charting.
     * GET /api/predictions/history/{facilityId}?hours=24
     */
    @GetMapping("/history/{facilityId}")
    public ResponseEntity<List<OccupancyHistory>> getHistory(
            @PathVariable Long facilityId,
            @RequestParam(defaultValue = "24") int hours) {
        return ResponseEntity.ok(predictionService.getOccupancyHistory(facilityId, hours));
    }
}
