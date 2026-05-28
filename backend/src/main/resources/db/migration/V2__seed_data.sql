-- Seed Users ('password123' BCrypt hash)
INSERT INTO users (id, email, password, full_name, phone, role, eco_points, latitude, longitude) VALUES
(1, 'priya.sharma@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Priya Sharma', '+91 98456 12340', 'CITIZEN', 340, 12.9716, 77.5946),
(2, 'raju.kumar@bbmp.gov.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Raju Kumar', '+91 98456 12341', 'WORKER', 0, 12.9784, 77.6408),
(3, 'ramesh.admin@bbmp.gov.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ramesh Admin', '+91 98456 12342', 'ADMIN', 0, 12.9716, 77.5946),
(4, 'commissioner@bbmp.gov.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Chief Commissioner', '+91 98456 12343', 'GOVERNMENT', 0, 12.9716, 77.5946),
(5, 'arun.mehta@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Arun Mehta', '+91 98456 12344', 'CITIZEN', 120, 12.9832, 77.6205);

-- Seed Cleaning Centers
INSERT INTO cleaning_centers (id, name, code, address, ward_number, zone, latitude, longitude) VALUES
(1, 'Indiranagar Ward Office', 'IND-W149', '12th Main Road, Indiranagar', 'W-149', 'East Zone', 12.9716, 77.6412),
(2, 'Koramangala Ward Office', 'KOR-W151', '5th Block, Koramangala', 'W-151', 'South-East Zone', 12.9352, 77.6245);

-- Seed Workers
INSERT INTO workers (id, user_id, cleaning_center_id, employee_id, shift_status, is_available, current_latitude, current_longitude) VALUES
(1, 2, 1, 'BBMP-WK-2891', 'ON_DUTY', true, 12.9784, 77.6408);

-- Seed Complaints
INSERT INTO complaints (id, citizen_id, assigned_worker_id, cleaning_center_id, title, description, status, priority, category, latitude, longitude, address, ward_number, zone) VALUES
(1001, 1, 1, 1, 'Overflowing garbage bin', 'Spilling onto sidewalk', 'IN_PROGRESS', 'HIGH', 'OVERFLOWING_BIN', 12.9784, 77.6408, '12th Main Rd, Indiranagar', 'W-149', 'East Zone'),
(1002, 5, NULL, NULL, 'Construction debris', 'Dumped on empty plot', 'SUBMITTED', 'MEDIUM', 'CONSTRUCTION_DEBRIS', 12.9121, 77.6446, 'Sector 2, HSR Layout', 'W-174', 'South Zone');

-- Seed Timeline
INSERT INTO complaint_timeline (complaint_id, actor_id, event_type, description) VALUES
(1001, 1, 'SUBMITTED', 'Complaint submitted with photo evidence'),
(1001, 3, 'ASSIGNED', 'Assigned to worker Raju Kumar');

-- Adjust sequences
SELECT setval('users_id_seq', 10);
SELECT setval('cleaning_centers_id_seq', 10);
SELECT setval('workers_id_seq', 10);
SELECT setval('complaints_id_seq', 2000);
