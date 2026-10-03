package com.parksensex.backend.repositories;

import com.parksensex.backend.models.ParkingFacility;
import com.parksensex.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingFacilityRepository extends JpaRepository<ParkingFacility, Long> {

    List<ParkingFacility> findByStatus(ParkingFacility.Status status);

    List<ParkingFacility> findByOperator(User operator);

    @Query("SELECT f FROM ParkingFacility f WHERE f.status = 'ACTIVE' AND f.city = :city")
    List<ParkingFacility> findActiveByCityLike(String city);

    @Query("""
        SELECT f FROM ParkingFacility f
        WHERE f.status = 'ACTIVE'
        AND (6371 * acos(cos(radians(:lat)) * cos(radians(f.latitude))
             * cos(radians(f.longitude) - radians(:lng))
             + sin(radians(:lat)) * sin(radians(f.latitude)))) < :radiusKm
        ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(f.latitude))
             * cos(radians(f.longitude) - radians(:lng))
             + sin(radians(:lat)) * sin(radians(f.latitude)))) ASC
        """)
    List<ParkingFacility> findNearby(double lat, double lng, double radiusKm);
}
