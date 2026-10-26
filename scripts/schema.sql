-- ============================================================================
-- CENTRALIZED ENTERPRISE PORTAL - RELATIONAL DATABASE SCHEMA (POSTGRESQL / MYSQL)
-- Comprehensive Schema with Foreign Keys, Check Constraints, Indexes & Audit Logs
-- File: scripts/schema.sql
-- ============================================================================

-- 1. ROLES TABLE (System-wide RBAC Roles)
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE (Centralized Identity Provider)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- 3. PROJECTS / MODULES TABLE (Independent Functional Modules)
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'PROJECT_INVENTORY', 'PROJECT_QUOTATIONS', 'PROJECT_PLANNING'
    name VARCHAR(150) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Folder',
    route_path VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'beta', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects (code);

-- 4. USER PROJECT PERMISSIONS TABLE (Project-Based Access Control)
CREATE TABLE IF NOT EXISTS user_project_permissions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    project_id VARCHAR(36) NOT NULL,
    can_read BOOLEAN DEFAULT TRUE,
    can_write BOOLEAN DEFAULT FALSE,
    can_export BOOLEAN DEFAULT FALSE,
    can_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_perm_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_perm_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT uq_user_project UNIQUE (user_id, project_id)
);
CREATE INDEX IF NOT EXISTS idx_user_project_perm ON user_project_permissions (user_id, project_id);

-- 5. INVENTORY ITEMS TABLE (Warehouse Project)
CREATE TABLE IF NOT EXISTS inventory_items (
    id VARCHAR(36) PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    size_dn VARCHAR(50) NOT NULL,
    standard VARCHAR(100) NOT NULL,
    quantity_in_stock INT NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0),
    min_reorder_level INT NOT NULL DEFAULT 10 CHECK (min_reorder_level >= 0),
    location_bin VARCHAR(100) NOT NULL, -- e.g. 'KHO-HN: K1-A04'
    unit_price_vnd DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    unit VARCHAR(20) DEFAULT 'Bộ',
    status VARCHAR(20) NOT NULL DEFAULT 'IN_STOCK' CHECK (status IN ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory_items (sku);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory_items (status);

-- 6. QUOTATIONS TABLE (Commercial Quotation Project)
CREATE TABLE IF NOT EXISTS quotations (
    id VARCHAR(36) PRIMARY KEY,
    quote_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'QTE-2026-1088'
    customer_name VARCHAR(150) NOT NULL,
    customer_company VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    subtotal_vnd DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    discount_vnd DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    vat_rate_percent DECIMAL(5, 2) NOT NULL DEFAULT 8.00,
    vat_amount_vnd DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    total_vnd DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'APPROVED', 'EXPIRED')),
    ai_generated_description TEXT,
    created_by_user_id VARCHAR(36) NOT NULL,
    pdf_exported BOOLEAN DEFAULT FALSE,
    pdf_exported_at TIMESTAMP WITH TIME ZONE,
    pdf_file_path VARCHAR(255), -- Absolute path in /public/uploads/quotations/
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quotations_user FOREIGN KEY (created_by_user_id) REFERENCES users (id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_quotations_number ON quotations (quote_number);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations (status);

-- 7. QUOTATION ITEMS TABLE (Detailed Line Items in Quotation)
CREATE TABLE IF NOT EXISTS quotation_items (
    id VARCHAR(36) PRIMARY KEY,
    quotation_id VARCHAR(36) NOT NULL,
    item_sku VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    specs TEXT,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price_vnd DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    discount_percent DECIMAL(5, 2) DEFAULT 0.00,
    subtotal_vnd DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_qitems_quotation FOREIGN KEY (quotation_id) REFERENCES quotations (id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_qitems_quotation ON quotation_items (quotation_id);

-- 8. AI SETTINGS TABLE (Dynamic AI Dashboard for Super Admin)
CREATE TABLE IF NOT EXISTS ai_settings (
    id VARCHAR(36) PRIMARY KEY,
    project_code VARCHAR(50) UNIQUE NOT NULL,
    model_name VARCHAR(100) NOT NULL DEFAULT 'gemini-2.5-flash',
    system_instruction TEXT NOT NULL,
    temperature DECIMAL(3, 2) NOT NULL DEFAULT 0.30 CHECK (temperature >= 0.0 AND temperature <= 2.0),
    top_p DECIMAL(3, 2) NOT NULL DEFAULT 0.90 CHECK (top_p >= 0.0 AND top_p <= 1.0),
    max_output_tokens INT NOT NULL DEFAULT 2048,
    is_enabled BOOLEAN DEFAULT TRUE,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ai_project FOREIGN KEY (project_code) REFERENCES projects (code) ON DELETE CASCADE,
    CONSTRAINT fk_ai_updated_by FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_ai_project_code ON ai_settings (project_code);

-- 9. DATABASE BACKUPS TABLE (Data Safety & Recovery Registry)
CREATE TABLE IF NOT EXISTS database_backups (
    id VARCHAR(36) PRIMARY KEY,
    file_name VARCHAR(255) UNIQUE NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    backup_type VARCHAR(30) DEFAULT 'DAILY_AUTOMATED' CHECK (backup_type IN ('DAILY_AUTOMATED', 'MANUAL_SNAPSHOT', 'PRE_DEPLOYMENT')),
    status VARCHAR(20) DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING')),
    checksum_sha256 VARCHAR(64) NOT NULL,
    storage_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SYSTEM AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS system_audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    username VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    status VARCHAR(20) DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'DENIED', 'WARN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON system_audit_logs (created_at DESC);

-- ============================================================================
-- SEED DATA INITIALIZATION
-- ============================================================================

INSERT INTO roles (id, code, name, description) VALUES
('role-01', 'SUPER_ADMIN', 'Quản trị viên Cao cấp', 'Toàn quyền truy cập mọi phân hệ, quản lý người dùng và cấu hình AI.'),
('role-02', 'WAREHOUSE_STAFF', 'Thủ kho', 'Truy cập phân hệ Quản lý kho, kiểm tra tồn kho và nhập xuất hàng.'),
('role-03', 'QUOTATION_SPECIALIST', 'Chuyên viên Báo giá', 'Truy cập phân hệ Báo giá và xuất PDF có xác thực.'),
('role-04', 'BUSINESS_PLANNER', 'Chuyên gia Kế hoạch', 'Truy cập phân hệ Kế hoạch kinh doanh và phân tích SWOT.');

INSERT INTO projects (id, code, name, description, icon_name, route_path, status) VALUES
('proj-01', 'PROJECT_INVENTORY', 'Hệ thống Quản lý Kho', 'Quản lý tồn kho công nghiệp, cảnh báo hàng sắp hết và gợi ý nhập hàng.', 'Package', '/portal/inventory', 'active'),
('proj-02', 'PROJECT_QUOTATIONS', 'Hệ thống Báo giá Dự án', 'Tạo báo giá kỹ thuật, hỗ trợ AI mô tả sản phẩm và xuất PDF bảo mật.', 'FileSpreadsheet', '/portal/quotations', 'active'),
('proj-03', 'PROJECT_PLANNING', 'Kế hoạch Kinh doanh & SWOT', 'Phân tích SWOT, lập kế hoạch doanh thu và tính điểm hòa vốn.', 'TrendingUp', '/portal/planning', 'active'),
('proj-04', 'PROJECT_ADMIN', 'Cổng Quản trị Super Admin', 'Quản lý phân quyền và cấu hình System Prompt AI trực tiếp.', 'Sliders', '/portal/admin', 'active');
