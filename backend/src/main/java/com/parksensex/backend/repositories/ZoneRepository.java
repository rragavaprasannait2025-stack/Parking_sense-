package com.parksensex.backend.repositories;

import com.parksensex.backend.models.Floor;
import com.parksensex.backend.models.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findByFloor(Floor floor);
    List<Zone> findByFloorFacilityId(Long facilityId);
}
