-- =============================================================================
-- INDUSTRACORP INDUSTRIAL VALVES - INDEPENDENT MYSQL DATABASE SCHEMA
-- Target Domain: https://www.industracorp.com
-- Designed for cPanel MySQL / phpMyAdmin / MariaDB / Supabase PostgreSQL
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table: products (Main industrial valve products catalog)
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `code` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) DEFAULT NULL,
  `brand` VARCHAR(100) DEFAULT 'UTD',
  `category` VARCHAR(100) NOT NULL,
  `category_label` VARCHAR(150) DEFAULT NULL,
  `category_label_en` VARCHAR(150) DEFAULT NULL,
  `system_group` VARCHAR(100) DEFAULT 'water',
  `system_group_label` VARCHAR(150) DEFAULT NULL,
  `image` VARCHAR(500) NOT NULL,
  `images` TEXT DEFAULT NULL,
  `badge` VARCHAR(150) DEFAULT NULL,
  `material` VARCHAR(255) NOT NULL,
  `material_en` VARCHAR(255) DEFAULT NULL,
  `material_group` VARCHAR(100) DEFAULT 'ss304_316',
  `pressure` VARCHAR(100) NOT NULL,
  `pressure_group` VARCHAR(100) DEFAULT 'pn16',
  `size_range` VARCHAR(100) NOT NULL,
  `temp_range` VARCHAR(150) DEFAULT NULL,
  `connection` VARCHAR(255) DEFAULT NULL,
  `applicable_media` TEXT DEFAULT NULL,
  `applicable_media_en` TEXT DEFAULT NULL,
  `standards` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `description_en` TEXT DEFAULT NULL,
  `highlight_features` TEXT DEFAULT NULL,
  `highlight_features_en` TEXT DEFAULT NULL,
  `leakage_class` VARCHAR(150) DEFAULT 'ISO 5208 Rate A',
  `test_pressure_shell` VARCHAR(100) DEFAULT '1.5 x PN',
  `test_pressure_seat` VARCHAR(100) DEFAULT '1.1 x PN',
  `reference_price_vnd` DECIMAL(15,2) DEFAULT 0.00,
  `cad_file_available` TINYINT(1) DEFAULT 1,
  `is_high_performance` TINYINT(1) DEFAULT 0,
  `is_customized` TINYINT(1) DEFAULT 0,
  `specs` LONGTEXT DEFAULT NULL,
  `equivalents` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_brand` (`brand`),
  INDEX `idx_pressure` (`pressure_group`),
  INDEX `idx_material` (`material_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: categories (Dynamic category taxonomy & navigation)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `label_vi` VARCHAR(150) NOT NULL,
  `label_en` VARCHAR(150) NOT NULL,
  `description_vi` VARCHAR(255) DEFAULT NULL,
  `description_en` VARCHAR(255) DEFAULT NULL,
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: b2b_members (Approved Dealers, Contractors, & VIP Member Records)
CREATE TABLE IF NOT EXISTS `b2b_members` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `tax_code` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'dealer',
  `status` ENUM('approved', 'pending', 'rejected') DEFAULT 'pending',
  `discount_rate_percent` INT DEFAULT 15,
  `position` VARCHAR(100) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `business_type` VARCHAR(150) DEFAULT NULL,
  `registered_at` DATE DEFAULT NULL,
  `approved_at` DATE DEFAULT NULL,
  `rejection_reason` VARCHAR(255) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_tax_code` (`tax_code`),
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: quotation_requests (RFQ Inquiries & Submissions)
CREATE TABLE IF NOT EXISTS `quotation_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `tax_code` VARCHAR(50) DEFAULT NULL,
  `contact_person` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `project_name` VARCHAR(255) DEFAULT NULL,
  `urgency_level` VARCHAR(50) DEFAULT 'normal',
  `items_json` LONGTEXT NOT NULL,
  `total_estimated_vnd` DECIMAL(15,2) DEFAULT 0.00,
  `status` ENUM('new', 'reviewing', 'quoted', 'closed') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
