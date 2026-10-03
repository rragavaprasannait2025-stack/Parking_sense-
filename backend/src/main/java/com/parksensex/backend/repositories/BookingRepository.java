package com.parksensex.backend.repositories;

import com.parksensex.backend.models.Booking;
import com.parksensex.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingRef(String bookingRef);

    List<Booking> findByUserOrderByCreatedAtDesc(User user);

    List<Booking> findByUserAndStatusIn(User user, List<Booking.BookingStatus> statuses);

    List<Booking> findByFacilityIdAndStatusIn(Long facilityId, List<Booking.BookingStatus> statuses);

    @Query("SELECT b FROM Booking b WHERE b.slot.id = :slotId AND b.status IN ('CONFIRMED', 'ACTIVE') AND b.startTime < :end AND b.endTime > :start")
    List<Booking> findConflictingBookings(Long slotId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.facility.id = :facilityId AND b.status IN ('CONFIRMED', 'ACTIVE') AND DATE(b.startTime) = CURRENT_DATE")
    long countActiveBookingsByFacility(Long facilityId);
}
