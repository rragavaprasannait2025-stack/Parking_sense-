package com.parksensex.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "zones")
@Data
@NoArgsConstructor
public class Zone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id", nullable = false)
    private Floor floor;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private ZoneType type = ZoneType.STANDARD;

    private Double priceMultiplier = 1.0;

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ParkingSlot> slots = new ArrayList<>();

    public enum ZoneType { STANDARD, EV, ACCESSIBLE, PREMIUM, MOTORCYCLE, COMPACT }
}
