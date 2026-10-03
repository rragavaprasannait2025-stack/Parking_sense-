-- ParkSense-X Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS parksensex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE parksensex;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    role        ENUM('DRIVER','OPERATOR','ADMIN') NOT NULL DEFAULT 'DRIVER',
    enabled     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME,
    INDEX idx_user_email (email)
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT NOT NULL UNIQUE,
    optimization_mode   ENUM('balanced','cheapest','closest','fastest','greenest') DEFAULT 'balanced',
    ev_only             BOOLEAN DEFAULT FALSE,
    accessible_only     BOOLEAN DEFAULT FALSE,
    max_walk_distance   INT DEFAULT 500,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Parking facilities
CREATE TABLE IF NOT EXISTS parking_facilities (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    address         VARCHAR(500),
    city            VARCHAR(100),
    latitude        DECIMAL(10,7),
    longitude       DECIMAL(10,7),
    total_slots     INT NOT NULL DEFAULT 0,
    price_per_hour  INT NOT NULL,
    currency        CHAR(3) DEFAULT 'INR',
    status          ENUM('ACTIVE','CLOSED','MAINTENANCE') DEFAULT 'ACTIVE',
    operator_id     BIGINT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (operator_id) REFERENCES users(id)
);

-- Floors
CREATE TABLE IF NOT EXISTS floors (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    facility_id BIGINT NOT NULL,
    level       INT NOT NULL,
    name        VARCHAR(50) NOT NULL,
    FOREIGN KEY (facility_id) REFERENCES parking_facilities(id) ON DELETE CASCADE
);

-- Zones
CREATE TABLE IF NOT EXISTS zones (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    floor_id          BIGINT NOT NULL,
    name              VARCHAR(50) NOT NULL,
    type              ENUM('STANDARD','EV','ACCESSIBLE','PREMIUM','MOTORCYCLE','COMPACT') DEFAULT 'STANDARD',
    price_multiplier  DECIMAL(4,2) DEFAULT 1.00,
    FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE CASCADE
);

-- Parking slots
CREATE TABLE IF NOT EXISTS parking_slots (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    zone_id         BIGINT NOT NULL,
    facility_id     BIGINT NOT NULL,
    slot_code       VARCHAR(10) NOT NULL,
    status          ENUM('AVAILABLE','OCCUPIED','RESERVED','MAINTENANCE','INACTIVE') DEFAULT 'AVAILABLE',
    type            ENUM('STANDARD','EV','ACCESSIBLE','PREMIUM','MOTORCYCLE','COMPACT') DEFAULT 'STANDARD',
    price_per_hour  INT NOT NULL,
    has_ev_charger  BOOLEAN DEFAULT FALSE,
    is_accessible   BOOLEAN DEFAULT FALSE,
    is_covered      BOOLEAN DEFAULT FALSE,
    near_entrance   BOOLEAN DEFAULT FALSE,
    near_elevator   BOOLEAN DEFAULT FALSE,
    last_updated    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slot_facility (facility_id),
    INDEX idx_slot_status   (status),
    FOREIGN KEY (zone_id)     REFERENCES zones(id) ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES parking_facilities(id)
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_ref         VARCHAR(10) NOT NULL UNIQUE,
    user_id             BIGINT NOT NULL,
    facility_id         BIGINT NOT NULL,
    slot_id             BIGINT NOT NULL,
    start_time          DATETIME NOT NULL,
    end_time            DATETIME NOT NULL,
    duration_minutes    INT NOT NULL,
    status              ENUM('PENDING','CONFIRMED','ACTIVE','COMPLETED','CANCELLED','NO_SHOW','EXPIRED') DEFAULT 'PENDING',
    total_amount        DECIMAL(10,2),
    currency            CHAR(3) DEFAULT 'INR',
    no_show_probability DECIMAL(5,2),
    qr_data             TEXT,
    carbon_kg           DECIMAL(6,3),
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at        DATETIME,
    check_in_time       DATETIME,
    check_out_time      DATETIME,
    INDEX idx_booking_user   (user_id),
    INDEX idx_booking_slot   (slot_id),
    INDEX idx_booking_ref    (booking_ref),
    INDEX idx_booking_status (status),
    FOREIGN KEY (user_id)     REFERENCES users(id),
    FOREIGN KEY (facility_id) REFERENCES parking_facilities(id),
    FOREIGN KEY (slot_id)     REFERENCES parking_slots(id)
);

-- Occupancy history
CREATE TABLE IF NOT EXISTS occupancy_history (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    facility_id     BIGINT NOT NULL,
    occupancy_rate  DECIMAL(5,2) NOT NULL,
    available_slots INT,
    recorded_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    source          ENUM('SENSOR','SIMULATION','MANUAL') DEFAULT 'SIMULATION',
    INDEX idx_occ_facility_time (facility_id, recorded_at),
    FOREIGN KEY (facility_id) REFERENCES parking_facilities(id)
);

-- Demand predictions
CREATE TABLE IF NOT EXISTS demand_predictions (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    facility_id         BIGINT NOT NULL,
    predicted_occupancy DECIMAL(5,2) NOT NULL,
    confidence          DECIMAL(5,2),
    horizon_minutes     INT NOT NULL,
    is_peak_period      BOOLEAN DEFAULT FALSE,
    model_name          VARCHAR(100),
    predicted_for       DATETIME NOT NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_source         ENUM('REAL','SIMULATED') DEFAULT 'SIMULATED',
    FOREIGN KEY (facility_id) REFERENCES parking_facilities(id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    type        VARCHAR(50) NOT NULL,
    title       VARCHAR(200) NOT NULL,
    message     TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    priority    ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'LOW',
    action_url  VARCHAR(500),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notif_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT,
    action      VARCHAR(100) NOT NULL,
    resource    VARCHAR(100),
    resource_id BIGINT,
    details     TEXT,
    ip_address  VARCHAR(50),
    result      ENUM('SUCCESS','FAILURE') DEFAULT 'SUCCESS',
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_time (created_at)
);

-- Events (for event-aware prediction)
CREATE TABLE IF NOT EXISTS parking_events (
    id                          BIGINT AUTO_INCREMENT PRIMARY KEY,
    facility_id                 BIGINT NOT NULL,
    name                        VARCHAR(200) NOT NULL,
    description                 TEXT,
    start_time                  DATETIME NOT NULL,
    end_time                    DATETIME NOT NULL,
    expected_demand_increase    INT DEFAULT 0,
    location                    VARCHAR(300),
    created_by                  BIGINT,
    FOREIGN KEY (facility_id)   REFERENCES parking_facilities(id),
    FOREIGN KEY (created_by)    REFERENCES users(id)
);
