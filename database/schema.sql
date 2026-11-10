CREATE DATABASE IF NOT EXISTS wfh_attendance
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wfh_attendance;

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(30) NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  department VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('HRD','EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  check_in_at DATETIME NULL,
  checkInPhoto VARCHAR(255) NULL,
  check_out_at DATETIME NULL,
  notes VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id)
    REFERENCES employees(id) ON DELETE RESTRICT,
  CONSTRAINT uq_employee_attendance_date UNIQUE (employee_id, attendance_date)
);

CREATE INDEX idx_attendance_date ON attendances(attendance_date);
CREATE INDEX idx_attendance_employee ON attendances(employee_id);
