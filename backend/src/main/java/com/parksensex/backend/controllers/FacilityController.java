package com.parksensex.backend.controllers;

import com.parksensex.backend.dto.FacilityDto;
import com.parksensex.backend.services.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public parking facility endpoints — available without authentication.
 */
@RestController
@RequestMapping("/api/parking")
@RequiredArgsConstructor
public class FacilityController {

    private final FacilityService facilityService;

    @GetMapping("/facilities")
    public ResponseEntity<List<FacilityDto>> getAll() {
        return ResponseEntity.ok(facilityService.getAllActive());
    }

    @GetMapping("/facilities/{id}")
    public ResponseEntity<FacilityDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(facilityService.getById(id));
    }

    @GetMapping("/facilities/nearby")
    public ResponseEntity<List<FacilityDto>> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10.0") double radius) {
        return ResponseEntity.ok(facilityService.getNearby(lat, lng, radius));
    }
}
