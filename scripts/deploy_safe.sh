#!/usr/bin/env bash
# ============================================================================
# ZERO-DATA-LOSS PRODUCTION DEPLOYMENT SCRIPT (SAFE DEPLOY)
# File: scripts/deploy_safe.sh
# Description: Deploys new application code while strictly PRESERVING:
#              1. /public/uploads/ directory (User images, product photos, PDF quotes)
#              2. Production Database (Never DROP or recreate tables)
#              3. .env environment secrets & configuration
# ============================================================================

set -euo pipefail

APP_ROOT="${APP_ROOT:-/var/www/industracorp_portal}"
SHARED_DIR="${SHARED_DIR:-/var/www/shared}"
UPLOADS_SHARED="${SHARED_DIR}/uploads"
ENV_FILE="${SHARED_DIR}/.env"
RELEASE_DIR="${APP_ROOT}/releases/$(date +"%Y%m%d_%H%M%S")"

echo "======================================================================"
echo " [SAFE DEPLOY] Bắt đầu quy trình triển khai phiên bản mới không mất dữ liệu"
echo " Thời gian: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "======================================================================"

# Step 1: Ensure persistent shared directories exist
echo "[STEP 1/6] Kiểm tra và khởi tạo thư mục lưu trữ độc lập (Shared Storage)..."
mkdir -p "${UPLOADS_SHARED}"
mkdir -p "${UPLOADS_SHARED}/quotations"
mkdir -p "${UPLOADS_SHARED}/products"
mkdir -p "${RELEASE_DIR}"

# Step 2: Trigger Pre-Deployment Database Snapshot
echo "[STEP 2/6] Kích hoạt sao lưu Database an toàn trước khi cập nhật mã nguồn..."
if [ -f "scripts/backup_cron.sh" ]; then
    bash scripts/backup_cron.sh || echo "[WARN] Sao lưu database có cảnh báo, tiếp tục triển khai thận trọng."
fi

# Step 3: Build application artifact
echo "[STEP 3/6] Biên dịch mã nguồn Frontend & Backend (Build)..."
npm run build

# Step 4: Copy built dist to new release directory
echo "[STEP 4/6] Sao chép build artifacts vào thư mục release mới..."
cp -r dist/* "${RELEASE_DIR}/"
cp package.json "${RELEASE_DIR}/"

# Step 5: Symlink persistent uploads and configuration (PRESERVATION)
# CRITICAL RULE: Never copy over /public/uploads/. Symlink it to persistent storage!
echo "[STEP 5/6] Thiết lập liên kết tượng trưng (Symlink) bảo vệ vĩnh viễn /uploads/ và .env..."
mkdir -p "${RELEASE_DIR}/public"
rm -rf "${RELEASE_DIR}/public/uploads" # Remove empty placeholder if any
ln -sfn "${UPLOADS_SHARED}" "${RELEASE_DIR}/public/uploads"

if [ -f "${ENV_FILE}" ]; then
    ln -sfn "${ENV_FILE}" "${RELEASE_DIR}/.env"
fi

# Step 6: Atomic Symlink Switch (Zero Downtime)
echo "[STEP 6/6] Chuyển đổi Symlink hiện tại sang bản phát hành mới (Atomic Switch)..."
ln -sfn "${RELEASE_DIR}" "${APP_ROOT}/current"

echo "======================================================================"
echo " [SAFE DEPLOY] Triển khai thành công 100%!"
echo " - Thư mục /public/uploads/ được bảo toàn nguyên vẹn tại: ${UPLOADS_SHARED}"
echo " - Cơ sở dữ liệu được bảo vệ an toàn (Không bao giờ ghi đè hoặc DROP)"
echo " - Release mới: ${RELEASE_DIR}"
echo "======================================================================"
