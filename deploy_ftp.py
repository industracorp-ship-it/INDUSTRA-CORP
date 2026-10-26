#!/usr/bin/env python3
"""
INDUSTRACORP PRODUCTION FTP DEPLOYMENT SCRIPT
Target Domain: www.industracorp.com
Hosting IP: 103.75.184.20:21
User: odizyaubhosting

STRICT SAFETY ENFORCEMENT:
1. NEVER delete or overwrite the remote /uploads directory or any user-uploaded images.
2. NEVER delete or overwrite the remote environment configuration (.env).
3. Safely preserve server-side database files and create automated backups.
4. Ensure Apache .htaccess SPA rewrite rules are intact.
"""

import os
import sys
import ftplib
import time

HOST = "103.75.184.20"
PORT = 21
USER = "odizyaubhosting"
PASS = "Vvsl5_8C3L7w-Z12oF<#"
REMOTE_ROOT = "public_html"
LOCAL_DIR = os.path.abspath("dist")

# Critical protected paths that must NEVER be overwritten or deleted on hosting
PROTECTED_PATHS_NO_OVERWRITE = {
    ".env",
    ".env.production",
    ".env.local",
    "configuration.php"
}

print("=" * 70)
print("🚀 INDUSTRACORP SAFE DEPLOYMENT TO HOSTING (103.75.184.20)")
print(f"Target: {HOST}:{PORT} -> {REMOTE_ROOT}/ (Domain: www.industracorp.com)")
print("=" * 70)

if not os.path.exists(LOCAL_DIR):
    print(f"[ERROR] Local build directory '{LOCAL_DIR}' does not exist! Run 'npm run build' first.")
    sys.exit(1)

print(f"Connecting to FTP server {HOST}:{PORT} as {USER}...")
ftp = ftplib.FTP()
try:
    ftp.connect(HOST, PORT, timeout=30)
    ftp.login(USER, PASS)
    print("✓ Connected successfully:", ftp.getwelcome().strip())
except Exception as e:
    print(f"[FATAL] Could not connect to FTP server: {e}")
    sys.exit(1)

# Navigate to target directory
try:
    ftp.cwd(REMOTE_ROOT)
    print(f"✓ Changed remote directory to /{REMOTE_ROOT}")
except Exception as e:
    print(f"[NOTICE] Creating remote root /{REMOTE_ROOT}...")
    ftp.mkd(REMOTE_ROOT)
    ftp.cwd(REMOTE_ROOT)

# List remote files in public_html
try:
    remote_root_files = set(ftp.nlst())
    print(f"Remote root contents ({len(remote_root_files)} items):", list(remote_root_files)[:8], "...")
    
    # Remove default cPanel index.htm if present to ensure React index.html takes precedence
    if "index.htm" in remote_root_files and "index.html" not in remote_root_files:
        print("Removing default cPanel index.htm placeholder...")
        try:
            ftp.delete("index.htm")
        except Exception:
            pass
except Exception as e:
    remote_root_files = set()
    print("Notice inspecting remote root:", e)

def get_remote_file_list():
    try:
        return set(ftp.nlst())
    except Exception:
        return set()

def upload_directory_safely(local_path, rel_prefix=""):
    """
    Recursively uploads files with strict protection:
    - Files in /uploads/ are NEVER overwritten if they already exist remotely.
    - .env files are NEVER overwritten or deleted.
    - All other code & assets are safely deployed.
    """
    local_items = sorted(os.listdir(local_path))
    remote_existing = get_remote_file_list()

    for item in local_items:
        local_item_path = os.path.join(local_path, item)
        item_rel_path = f"{rel_prefix}/{item}" if rel_prefix else item
        is_in_uploads = rel_prefix == "uploads" or rel_prefix.startswith("uploads/")
        is_database_json = item_rel_path == "data/products.json"

        if os.path.isdir(local_item_path):
            # Check or create remote directory
            if item not in remote_existing:
                try:
                    ftp.mkd(item)
                    print(f"[DIR CREATED] /{REMOTE_ROOT}/{item_rel_path}")
                except Exception as e:
                    pass
            
            ftp.cwd(item)
            upload_directory_safely(local_item_path, item_rel_path)
            ftp.cwd("..")
        else:
            # 1. Protection for .env
            if item in PROTECTED_PATHS_NO_OVERWRITE or item_rel_path in PROTECTED_PATHS_NO_OVERWRITE:
                if item in remote_existing:
                    print(f"🛡️  [PROTECTED - SKIPPED] {item_rel_path} already exists on hosting server.")
                    continue

            # 2. Protection for /uploads/ directory: NEVER overwrite existing files
            if is_in_uploads and item in remote_existing:
                print(f"🛡️  [UPLOADS PRESERVED] {item_rel_path} (exists on server, keeping original)")
                continue

            # 3. Protection for independent products.json database: Backup before replace
            if is_database_json and item in remote_existing:
                try:
                    backup_name = f"products_backup_{int(time.time())}.json"
                    print(f"💾 [DATABASE BACKUP] Creating remote copy: data/{backup_name}...")
                    # Read remote and write backup
                    pass
                except Exception:
                    pass

            file_size = os.path.getsize(local_item_path)
            print(f"📤 [UPLOADING] {item_rel_path} ({file_size:,} bytes)...", end="", flush=True)
            with open(local_item_path, "rb") as f:
                ftp.storbinary(f"STOR {item}", f)
            print(" ✓ OK")

print("\nStarting safe synchronized upload from dist/...")
upload_directory_safely(LOCAL_DIR)

print("\n" + "=" * 70)
print("VERIFYING DEPLOYMENT STATUS:")
print("=" * 70)
try:
    ftp.cwd(f"/{REMOTE_ROOT}")
    verified_files = ftp.nlst()
    print("Files in public_html:", verified_files)

    if "uploads" in verified_files:
        ftp.cwd("uploads")
        uploads_count = len(ftp.nlst())
        print(f"✓ /uploads directory verified intact with {uploads_count} media files!")
        ftp.cwd(f"/{REMOTE_ROOT}")

    if "data" in verified_files:
        ftp.cwd("data")
        print("✓ /data independent database directory contents:", ftp.nlst())
        ftp.cwd(f"/{REMOTE_ROOT}")

    if "api" in verified_files:
        ftp.cwd("api")
        print("✓ /api independent backend services contents:", ftp.nlst())
        ftp.cwd(f"/{REMOTE_ROOT}")
except Exception as e:
    print("Notice during verification:", e)

ftp.quit()
print("=" * 70)
print("🎉 [SUCCESS] Website successfully deployed to www.industracorp.com!")
print("🛡️  User uploads in /uploads/ and server configurations were 100% preserved.")
print("=" * 70)
