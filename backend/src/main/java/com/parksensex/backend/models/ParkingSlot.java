package com.parksensex.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Individual parking slot — finest granularity in the facility hierarchy.
 */
@Entity
@Table(name = "parking_slots", indexes = {
    @Index(name = "idx_slot_facility", columnList = "facility_id"),
    @Index(name = "idx_slot_status",   columnList = "status"),
})
@Data
@NoArgsConstructor
public class ParkingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id", nullable = false)
    private Zone zone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id", nullable = false)
    private ParkingFacility facility;

    @Column(nullable = false, length = 10)
    private String slotCode;        // e.g. "B24"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus status = SlotStatus.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotType type = SlotType.STANDARD;

    @Column(nullable = false)
    private Integer pricePerHour;

    private Boolean hasEvCharger  = false;
    private Boolean isAccessible  = false;
    private Boolean isCovered     = false;
    private Boolean nearEntrance  = false;
    private Boolean nearElevator  = false;

    private LocalDateTime lastUpdated = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    public enum SlotStatus { AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE, INACTIVE }
    public enum SlotType   { STANDARD, EV, ACCESSIBLE, PREMIUM, MOTORCYCLE, COMPACT }
}
