<?php
/**
 * INDUSTRACORP INDUSTRIAL VALVES - SECURE ASSET UPLOAD ENDPOINT
 * Handles persistent image uploads to /uploads/ directory on hosting.
 * Returns absolute URLs to avoid relative path resolution errors.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed. Only POST is accepted.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$baseDir = dirname(__DIR__);
$uploadDir = $baseDir . '/uploads';

if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

// Compute target server scheme and host
$scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'https';
$host = $_SERVER['HTTP_HOST'] ?? 'www.industracorp.com';
$domain = "{$scheme}://{$host}";

if (empty($_FILES['image']) && empty($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No image file uploaded (expected field "image" or "file")'], JSON_UNESCAPED_UNICODE);
    exit;
}

$file = $_FILES['image'] ?? $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'File upload error code: ' . $file['error']], JSON_UNESCAPED_UNICODE);
    exit;
}

// Check file size (max 15MB)
if ($file['size'] > 15 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'File size exceeds maximum limit of 15MB'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Validate file type
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);
$allowedMimes = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/svg+xml' => 'svg'
];

if (!array_key_exists($mimeType, $allowedMimes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file format. Allowed: JPG, PNG, WEBP, SVG (detected: ' . $mimeType . ')'], JSON_UNESCAPED_UNICODE);
    exit;
}

$ext = $allowedMimes[$mimeType];
$origName = pathinfo($file['name'], PATHINFO_FILENAME);
$cleanName = preg_replace('/[^a-zA-Z0-9_-]/', '_', strtolower($origName));
$cleanName = substr($cleanName, 0, 30);
$filename = "valve_{$cleanName}_" . time() . "_{$ext}." . $ext;
$targetPath = $uploadDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file to /uploads/ directory'], JSON_UNESCAPED_UNICODE);
    exit;
}

chmod($targetPath, 0644);

$absoluteUrl = "{$domain}/uploads/{$filename}";
$relativePath = "/uploads/{$filename}";

echo json_encode([
    'success' => true,
    'message' => 'Upload ảnh sản phẩm thành công!',
    'url' => $absoluteUrl,
    'relativePath' => $relativePath,
    'filename' => $filename,
    'sizeBytes' => filesize($targetPath)
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
exit;
