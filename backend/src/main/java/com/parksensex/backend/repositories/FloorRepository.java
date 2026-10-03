package com.parksensex.backend.repositories;

import com.parksensex.backend.models.Floor;
import com.parksensex.backend.models.ParkingFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FloorRepository extends JpaRepository<Floor, Long> {
    List<Floor> findByFacilityOrderByLevelAsc(ParkingFacility facility);
}
