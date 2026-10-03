-- ParkSense-X Seed Data (Demo)
-- Realistic demo data for development and presentation
USE parksensex;

-- Demo users (password: Demo1234 → BCrypt hash)
INSERT IGNORE INTO users (id, name, email, password, phone, role) VALUES
(1, 'Arjun Krishnamurthy', 'driver@demo.com',   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TuIbQDlOxhexFMGW0mE4.4z5QV3a', '+91 98412 34567', 'DRIVER'),
(2, 'Priya Venkataraman',  'operator@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TuIbQDlOxhexFMGW0mE4.4z5QV3a', '+91 98765 12345', 'OPERATOR'),
(3, 'Rajan Subramaniam',   'admin@demo.com',    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TuIbQDlOxhexFMGW0mE4.4z5QV3a', '+91 94433 56789', 'ADMIN'),
(4, 'Divya Nair',          'divya@demo.com',    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TuIbQDlOxhexFMGW0mE4.4z5QV3a', '+91 99001 23456', 'DRIVER');

-- Demo facilities
INSERT IGNORE INTO parking_facilities (id, name, address, city, latitude, longitude, total_slots, price_per_hour, status, operator_id) VALUES
(1, 'Chennai Trade Centre Parking', '18/1 Nandambakkam, Kathipara Junction', 'Chennai', 13.0067, 80.2206, 240, 60, 'ACTIVE', 2),
(2, 'Phoenix Marketcity Smart Parking', 'Velachery Tambaram Main Road, Velachery', 'Chennai', 12.9757, 80.2218, 380, 40, 'ACTIVE', 2),
(3, 'Express Avenue Parking', 'Whites Road, Royapettah', 'Chennai', 13.0569, 80.2590, 300, 50, 'ACTIVE', 2);

-- Floors for facility 1
INSERT IGNORE INTO floors (id, facility_id, level, name) VALUES
(1, 1, 1, 'Level 1 (Ground)'),
(2, 1, 2, 'Level 2');

-- Zones
INSERT IGNORE INTO zones (id, floor_id, name, type, price_multiplier) VALUES
(1, 1, 'Zone A', 'STANDARD', 1.00),
(2, 1, 'Zone B', 'STANDARD', 1.00),
(3, 1, 'Zone C (EV)', 'EV', 1.30),
(4, 2, 'Zone D', 'STANDARD', 1.00),
(5, 2, 'Zone E (Premium)', 'PREMIUM', 1.50);
