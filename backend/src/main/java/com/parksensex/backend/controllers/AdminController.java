package com.parksensex.backend.controllers;

import com.parksensex.backend.dto.AuthResponse;
import com.parksensex.backend.models.User;
import com.parksensex.backend.repositories.UserRepository;
import com.parksensex.backend.services.MlServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Admin-only platform management endpoints.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepo;
    private final MlServiceClient mlClient;
    private final WebClient.Builder webClientBuilder;

    @GetMapping("/users")
    public ResponseEntity<List<AuthResponse.UserDto>> getAllUsers() {
        return ResponseEntity.ok(
            userRepo.findAll().stream()
                .map(AuthResponse::toDto)
                .collect(Collectors.toList())
        );
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<AuthResponse.UserDto> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        var user = userRepo.findById(id)
            .orElseThrow(() -> new com.parksensex.backend.exceptions.ApiException(
                "User not found",
                org.springframework.http.HttpStatus.NOT_FOUND
            ));

        String role = body.get("role");

        if (role == null || role.isBlank()) {
            throw new com.parksensex.backend.exceptions.ApiException(
                "Role is required",
                org.springframework.http.HttpStatus.BAD_REQUEST
            );
        }

        try {
            user.setRole(User.Role.valueOf(role.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new com.parksensex.backend.exceptions.ApiException(
                "Invalid role: " + role,
                org.springframework.http.HttpStatus.BAD_REQUEST
            );
        }

        userRepo.save(user);

        return ResponseEntity.ok(AuthResponse.toDto(user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepo.existsById(id)) {
            throw new com.parksensex.backend.exceptions.ApiException(
                "User not found",
                org.springframework.http.HttpStatus.NOT_FOUND
            );
        }

        userRepo.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ml/health")
    public ResponseEntity<Map<String, Object>> mlHealth() {

        boolean healthy = mlClient.isHealthy();

        return ResponseEntity.ok(Map.of(
            "mlServiceUrl", mlClient.getMlServiceUrl(),
            "healthy", healthy,
            "status", healthy ? "CONNECTED" : "UNAVAILABLE"
        ));
    }

    @GetMapping("/ml/models")
    public ResponseEntity<?> getModelMetrics() {

        try {
            List<Object> response = webClientBuilder
                .baseUrl(mlClient.getMlServiceUrl())
                .build()
                .get()
                .uri("/api/evaluation/models")
                .retrieve()
                .bodyToFlux(Object.class)
                .collectList()
                .block(Duration.ofSeconds(10));

            return ResponseEntity.ok(
                response != null ? response : List.of()
            );

        } catch (Exception e) {

            return ResponseEntity.ok(
                List.of(
                    Map.of(
                        "error", "ML service unavailable",
                        "message", e.getMessage() != null
                            ? e.getMessage()
                            : "Unable to connect to ML service"
                    )
                )
            );
        }
    }
}