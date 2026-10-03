package com.parksensex.backend.services;

import com.parksensex.backend.dto.PredictionDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

/**
 * Client for the FastAPI Python ML microservice.
 * Spring Boot calls this service to obtain:
 *  - Demand/occupancy predictions
 *  - No-show risk scores
 *  - Multi-objective slot recommendations
 *
 * Falls back gracefully when the ML service is unavailable (demo mode).
 */
@Slf4j
@Service
public class MlServiceClient {

    private final WebClient webClient;
    private final String mlServiceUrl;

    public MlServiceClient(@Value("${parksensex.ml.service.url:http://localhost:8001}") String mlServiceUrl) {
        this.mlServiceUrl = mlServiceUrl;
        this.webClient = WebClient.builder()
            .baseUrl(mlServiceUrl)
            .codecs(c -> c.defaultCodecs().maxInMemorySize(2 * 1024 * 1024))
            .build();
    }

    // ─── Health ───────────────────────────────────────────────────────────────

    public boolean isHealthy() {
        try {
            var response = webClient.get()
                .uri("/health")
                .retrieve()
                .bodyToMono(PredictionDto.HealthResponse.class)
                .block(Duration.ofSeconds(3));
            return response != null && "ok".equals(response.getStatus());
        } catch (Exception e) {
            log.warn("ML service health check failed: {}", e.getMessage());
            return false;
        }
    }

    // ─── Demand Prediction ────────────────────────────────────────────────────

    public Optional<PredictionDto.DemandResponse> predictDemand(PredictionDto.DemandRequest request) {
        try {
            var response = webClient.post()
                .uri("/api/predictions/demand")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(PredictionDto.DemandResponse.class)
                .block(Duration.ofSeconds(10));
            return Optional.ofNullable(response);
        } catch (WebClientException e) {
            log.error("ML demand prediction failed: {}", e.getMessage());
            return Optional.empty();
        }
    }

    // ─── No-Show Prediction ───────────────────────────────────────────────────

    public Optional<PredictionDto.NoShowResponse> predictNoShow(PredictionDto.NoShowRequest request) {
        try {
            var response = webClient.post()
                .uri("/api/predictions/noshow")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(PredictionDto.NoShowResponse.class)
                .block(Duration.ofSeconds(10));
            return Optional.ofNullable(response);
        } catch (WebClientException e) {
            log.error("ML no-show prediction failed: {}", e.getMessage());
            return Optional.empty();
        }
    }

    // ─── Slot Recommendations ─────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    public List<PredictionDto.ScoredSlotDto> recommendSlots(PredictionDto.RecommendationRequest request) {
        try {
            var response = webClient.post()
                .uri("/api/recommendations/slots")
                .bodyValue(request)
                .retrieve()
                .bodyToFlux(PredictionDto.ScoredSlotDto.class)
                .collectList()
                .block(Duration.ofSeconds(15));
            return response != null ? response : List.of();
        } catch (WebClientException e) {
            log.error("ML slot recommendation failed: {}", e.getMessage());
            return List.of();
        }
    }

    public String getMlServiceUrl() { return mlServiceUrl; }
}
