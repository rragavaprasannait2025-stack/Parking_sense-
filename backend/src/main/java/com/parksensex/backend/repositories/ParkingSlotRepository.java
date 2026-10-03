package com.parksensex.backend.repositories;

import com.parksensex.backend.models.ParkingFacility;
import com.parksensex.backend.models.ParkingSlot;
import com.parksensex.backend.models.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {

    List<ParkingSlot> findByFacility(ParkingFacility facility);

    List<ParkingSlot> findByFacilityAndStatus(ParkingFacility facility, ParkingSlot.SlotStatus status);

    List<ParkingSlot> findByZone(Zone zone);

    @Query("SELECT COUNT(s) FROM ParkingSlot s WHERE s.facility = :facility AND s.status = 'AVAILABLE'")
    long countAvailableByFacility(ParkingFacility facility);

    @Query("SELECT COUNT(s) FROM ParkingSlot s WHERE s.facility = :facility AND s.status = 'OCCUPIED'")
    long countOccupiedByFacility(ParkingFacility facility);

    @Query("SELECT s FROM ParkingSlot s WHERE s.facility.id = :facilityId AND s.status = 'AVAILABLE' ORDER BY s.pricePerHour ASC")
    List<ParkingSlot> findAvailableByFacilityId(Long facilityId);
}
