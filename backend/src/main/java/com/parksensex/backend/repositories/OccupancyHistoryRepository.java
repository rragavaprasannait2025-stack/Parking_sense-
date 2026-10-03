package com.parksensex.backend.repositories;

import com.parksensex.backend.models.OccupancyHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OccupancyHistoryRepository extends JpaRepository<OccupancyHistory, Long> {

    List<OccupancyHistory> findByFacilityIdAndRecordedAtAfterOrderByRecordedAtAsc(
        Long facilityId, LocalDateTime after);

    @Query("SELECT h FROM OccupancyHistory h WHERE h.facility.id = :facilityId ORDER BY h.recordedAt DESC")
    List<OccupancyHistory> findLatestByFacilityId(Long facilityId);

    @Query(value = """
        SELECT * FROM occupancy_history
        WHERE facility_id = :facilityId
          AND recorded_at >= :from
          AND recorded_at <= :to
        ORDER BY recorded_at ASC
        """, nativeQuery = true)
    List<OccupancyHistory> findByFacilityAndRange(Long facilityId, LocalDateTime from, LocalDateTime to);
}
