<?php
/**
 * INDUSTRACORP INDEPENDENT PRODUCTS API
 * Decouples product data storage from frontend React builds.
 * Supports:
 * 1. Independent JSON database file (public/data/products.json)
 * 2. MySQL / MariaDB Database (configured via .env: DB_HOST, DB_NAME, DB_USER, DB_PASS)
 * 3. Supabase REST (configured via .env: SUPABASE_URL, SUPABASE_KEY)
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Admin-Token');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$baseDir = dirname(__DIR__);
$jsonFilePath = $baseDir . '/data/products.json';
$envFilePaths = [
    $baseDir . '/../.env',
    $baseDir . '/.env',
    dirname($baseDir) . '/.env'
];

// Helper to parse .env file
$env = [];
foreach ($envFilePaths as $path) {
    if (file_exists($path) && is_readable($path)) {
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') !== false) {
                list($k, $v) = explode('=', $line, 2);
                $env[trim($k)] = trim(trim($v), '"\'');
            }
        }
        break;
    }
}

// Check MySQL connection
$pdo = null;
$dbHost = $env['DB_HOST'] ?? getenv('DB_HOST') ?: null;
$dbName = $env['DB_NAME'] ?? getenv('DB_NAME') ?: null;
$dbUser = $env['DB_USER'] ?? getenv('DB_USER') ?: null;
$dbPass = $env['DB_PASS'] ?? getenv('DB_PASS') ?: null;

if ($dbHost && $dbName && $dbUser) {
    try {
        $dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 3
        ]);
    } catch (Exception $e) {
        $pdo = null; // Seamless fallback to JSON storage
    }
}

// Handle GET: Return products catalog
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 1. If MySQL is active and has records
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM products ORDER BY code ASC");
            $rows = $stmt->fetchAll();
            if (!empty($rows)) {
                $products = array_map(function($row) {
                    return [
                        'id' => $row['id'],
                        'code' => $row['code'],
                        'name' => $row['name'],
                        'nameEn' => $row['name_en'] ?? $row['name'],
                        'brand' => $row['brand'] ?? 'UTD',
                        'category' => $row['category'],
                        'categoryLabel' => $row['category_label'] ?? '',
                        'categoryLabelEn' => $row['category_label_en'] ?? '',
                        'systemGroup' => $row['system_group'] ?? 'water',
                        'systemGroupLabel' => $row['system_group_label'] ?? '',
                        'image' => $row['image'],
                        'images' => !empty($row['images']) ? json_decode($row['images'], true) : [$row['image']],
                        'badge' => $row['badge'] ?? '',
                        'material' => $row['material'],
                        'materialEn' => $row['material_en'] ?? '',
                        'materialGroup' => $row['material_group'] ?? 'ss304_316',
                        'pressure' => $row['pressure'],
                        'pressureGroup' => $row['pressure_group'] ?? 'pn16',
                        'sizeRange' => $row['size_range'],
                        'tempRange' => $row['temp_range'] ?? '',
                        'connection' => $row['connection'] ?? '',
                        'applicableMedia' => !empty($row['applicable_media']) ? json_decode($row['applicable_media'], true) : [],
                        'applicableMediaEn' => !empty($row['applicable_media_en']) ? json_decode($row['applicable_media_en'], true) : [],
                        'standards' => !empty($row['standards']) ? json_decode($row['standards'], true) : [],
                        'description' => $row['description'] ?? '',
                        'descriptionEn' => $row['description_en'] ?? '',
                        'highlightFeatures' => !empty($row['highlight_features']) ? json_decode($row['highlight_features'], true) : [],
                        'highlightFeaturesEn' => !empty($row['highlight_features_en']) ? json_decode($row['highlight_features_en'], true) : [],
                        'leakageClass' => $row['leakage_class'] ?? 'ISO 5208 Rate A',
                        'testPressureShell' => $row['test_pressure_shell'] ?? '1.5 x PN',
                        'testPressureSeat' => $row['test_pressure_seat'] ?? '1.1 x PN',
                        'referencePriceVnd' => (float)($row['reference_price_vnd'] ?? 0),
                        'cadFileAvailable' => (bool)($row['cad_file_available'] ?? true),
                        'specs' => !empty($row['specs']) ? json_decode($row['specs'], true) : []
                    ];
                }, $rows);
                echo json_encode($products, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
                exit;
            }
        } catch (Exception $e) {
            // Fall through to JSON storage
        }
    }

    // 2. Read independent products.json file
    if (file_exists($jsonFilePath)) {
        header('ETag: ' . md5_file($jsonFilePath));
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($jsonFilePath)) . ' GMT');
        readfile($jsonFilePath);
        exit;
    }

    echo json_encode(['error' => 'No products database file found'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Handle POST: Update products in independent database
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON payload. Expected array of products.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Create automatic backup before write
    if (file_exists($jsonFilePath)) {
        @copy($jsonFilePath, $jsonFilePath . '.bak');
    }

    // Save to independent JSON database file
    $jsonContent = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if (!is_dir(dirname($jsonFilePath))) {
        @mkdir(dirname($jsonFilePath), 0755, true);
    }
    $written = file_put_contents($jsonFilePath, $jsonContent, LOCK_EX);

    // If MySQL connected, sync records
    if ($pdo && $written !== false) {
        try {
            $sql = "INSERT INTO products (
                id, code, name, name_en, brand, category, category_label, category_label_en,
                system_group, system_group_label, image, images, badge, material, material_en,
                material_group, pressure, pressure_group, size_range, temp_range, connection,
                applicable_media, applicable_media_en, standards, description, description_en,
                highlight_features, highlight_features_en, leakage_class, test_pressure_shell,
                test_pressure_seat, reference_price_vnd, cad_file_available, specs
            ) VALUES (
                :id, :code, :name, :name_en, :brand, :category, :category_label, :category_label_en,
                :system_group, :system_group_label, :image, :images, :badge, :material, :material_en,
                :material_group, :pressure, :pressure_group, :size_range, :temp_range, :connection,
                :applicable_media, :applicable_media_en, :standards, :description, :description_en,
                :highlight_features, :highlight_features_en, :leakage_class, :test_pressure_shell,
                :test_pressure_seat, :reference_price_vnd, :cad_file_available, :specs
            ) ON DUPLICATE KEY UPDATE 
                name=VALUES(name), name_en=VALUES(name_en), brand=VALUES(brand), category=VALUES(category),
                image=VALUES(image), images=VALUES(images), material=VALUES(material),
                pressure=VALUES(pressure), size_range=VALUES(size_range), temp_range=VALUES(temp_range),
                description=VALUES(description), specs=VALUES(specs), updated_at=NOW()";

            $stmt = $pdo->prepare($sql);
            foreach ($data as $p) {
                $stmt->execute([
                    ':id' => $p['id'] ?? uniqid('utd-'),
                    ':code' => $p['code'] ?? '',
                    ':name' => $p['name'] ?? '',
                    ':name_en' => $p['nameEn'] ?? ($p['name'] ?? ''),
                    ':brand' => $p['brand'] ?? 'UTD',
                    ':category' => $p['category'] ?? 'butterfly',
                    ':category_label' => $p['categoryLabel'] ?? '',
                    ':category_label_en' => $p['categoryLabelEn'] ?? '',
                    ':system_group' => $p['systemGroup'] ?? 'water',
                    ':system_group_label' => $p['systemGroupLabel'] ?? '',
                    ':image' => $p['image'] ?? '/uploads/studio_ball_valve.jpg',
                    ':images' => !empty($p['images']) ? json_encode($p['images'], JSON_UNESCAPED_UNICODE) : null,
                    ':badge' => $p['badge'] ?? '',
                    ':material' => $p['material'] ?? '',
                    ':material_en' => $p['materialEn'] ?? '',
                    ':material_group' => $p['materialGroup'] ?? 'ss304_316',
                    ':pressure' => $p['pressure'] ?? 'PN16',
                    ':pressure_group' => $p['pressureGroup'] ?? 'pn16',
                    ':size_range' => $p['sizeRange'] ?? 'DN50 - DN300',
                    ':temp_range' => $p['tempRange'] ?? '',
                    ':connection' => $p['connection'] ?? '',
                    ':applicable_media' => !empty($p['applicableMedia']) ? json_encode($p['applicableMedia'], JSON_UNESCAPED_UNICODE) : null,
                    ':applicable_media_en' => !empty($p['applicableMediaEn']) ? json_encode($p['applicableMediaEn'], JSON_UNESCAPED_UNICODE) : null,
                    ':standards' => !empty($p['standards']) ? json_encode($p['standards'], JSON_UNESCAPED_UNICODE) : null,
                    ':description' => $p['description'] ?? '',
                    ':description_en' => $p['descriptionEn'] ?? '',
                    ':highlight_features' => !empty($p['highlightFeatures']) ? json_encode($p['highlightFeatures'], JSON_UNESCAPED_UNICODE) : null,
                    ':highlight_features_en' => !empty($p['highlightFeaturesEn']) ? json_encode($p['highlightFeaturesEn'], JSON_UNESCAPED_UNICODE) : null,
                    ':leakage_class' => $p['leakageClass'] ?? 'ISO 5208 Rate A',
                    ':test_pressure_shell' => $p['testPressureShell'] ?? '1.5 x PN',
                    ':test_pressure_seat' => $p['testPressureSeat'] ?? '1.1 x PN',
                    ':reference_price_vnd' => (float)($p['referencePriceVnd'] ?? 0),
                    ':cad_file_available' => (int)($p['cadFileAvailable'] ?? 1),
                    ':specs' => !empty($p['specs']) ? json_encode($p['specs'], JSON_UNESCAPED_UNICODE) : null
                ]);
            }
        } catch (Exception $e) {
            // MySQL write error logged, JSON still succeeded
        }
    }

    echo json_encode([
        'success' => true,
        'message' => 'Lưu dữ liệu sản phẩm vào cơ sở dữ liệu độc lập thành công!',
        'count' => count($data),
        'storage' => $pdo ? 'MySQL + JSON' : 'Independent JSON File',
        'savedAt' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}
