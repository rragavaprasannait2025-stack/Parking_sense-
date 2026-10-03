package com.parksensex.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "occupancy_history", indexes = {
    @Index(name = "idx_occ_facility_time", columnList = "facility_id, recorded_at")
})
@Data
@NoArgsConstructor
public class OccupancyHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id", nullable = false)
    private ParkingFacility facility;

    @Column(nullable = false, precision = 5)
    private Double occupancyRate;

    private Integer availableSlots;

    @Column(nullable = false)
    private LocalDateTime recordedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private Source source = Source.SIMULATION;

    public enum Source { SENSOR, SIMULATION, MANUAL }
}
