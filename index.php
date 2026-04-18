<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

// CORE BETÖLTÉSE
require_once __DIR__ . '/app/Core/Database.php';
require_once __DIR__ . '/app/Core/Response.php';
require_once __DIR__ . '/app/Core/Mailer.php';

// CONTROLLEREK
require_once __DIR__ . '/app/Controllers/AsztalController.php';
require_once __DIR__ . '/app/Controllers/FoglalasController.php';
require_once __DIR__ . '/app/Controllers/VendegController.php';
require_once __DIR__ . '/app/Controllers/AdminController.php';

// ROUTING
$uri  = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/Backendd/index.php', '', $uri);
$method = $_SERVER['REQUEST_METHOD'];

// =====================
// ASZTAL
// =====================
if ($method === 'GET' && $path === '/asztalok') {
    (new AsztalController())->index();
    exit;
}
if ($method === 'GET' && $path === '/asztalok/szabad') {
    (new AsztalController())->szabad();
    exit;
}

// =====================
// FOGLALÁS
// =====================
if ($method === 'POST' && $path === '/foglalas') {
    (new FoglalasController())->store();
    exit;
}
if ($method === 'GET' && $path === '/foglalas/sajat') {
    (new FoglalasController())->sajat();
    exit;
}
if ($method === 'GET' && $path === '/foglalas/foglalt') {
    (new FoglalasController())->foglalt();
    exit;
}
if ($method === 'DELETE' && preg_match('#^/foglalas/(\d+)$#', $path, $matches)) {
    (new FoglalasController())->delete($matches[1]);
    exit;
}

// =====================
// VENDÉG
// =====================
if ($method === 'POST' && $path === '/vendeg/register') {
    (new VendegController())->register();
    exit;
}
if ($method === 'POST' && $path === '/vendeg/login') {
    (new VendegController())->login();
    exit;
}
if ($method === 'GET' && $path === '/vendeg/profil') {
    (new VendegController())->profil();
    exit;
}
if ($method === 'PUT' && $path === '/vendeg/update') {
    (new VendegController())->update();
    exit;
}

// =====================
// ADMIN
// =====================
if ($method === 'POST' && $path === '/admin/login') {
    (new AdminController())->login();
    exit;
}
if ($method === 'GET' && $path === '/admin/vendegek') {
    (new AdminController())->vendegek();
    exit;
}
if ($method === 'GET' && $path === '/admin/foglalasok') {
    (new AdminController())->foglalasok();
    exit;
}

// Vendég tiltás/feloldás toggle
if ($method === 'PATCH' && preg_match('#^/admin/vendeg/(\d+)/tiltas$#', $path, $matches)) {
    (new AdminController())->tiltasToggle($matches[1]);
    exit;
}

// Asztal hozzáadása
if ($method === 'POST' && $path === '/admin/asztal') {
    (new AdminController())->asztalHozzaad();
    exit;
}

// Asztal törlése
if ($method === 'DELETE' && preg_match('#^/admin/asztal/(\d+)$#', $path, $matches)) {
    (new AdminController())->asztalTorol($matches[1]);
    exit;
}

// =====================
// 404
// =====================
http_response_code(404);
echo json_encode(["error" => "Nincs ilyen végpont", "path" => $path, "method" => $method]);