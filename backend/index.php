<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// JSON válasz
header("Content-Type: application/json");

// ===== CONTROLLEREK BETÖLTÉSE =====
require_once __DIR__ . '/app/Controllers/AsztalController.php';
require_once __DIR__ . '/app/Controllers/FoglalasController.php';
require_once __DIR__ . '/app/Controllers/VendegController.php';
require_once __DIR__ . '/app/Controllers/AdminController.php';

// ===== URL FELDOLGOZÁS =====
// Teljes útvonal (pl. /Backendd/index.php/foglalas)
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Levágjuk az elejét
// FONTOS: Backendd pontosan így szerepeljen, ahogy a mappád neve!
$path = str_replace('/Backendd/index.php', '', $uri);

// HTTP metódus
$method = $_SERVER['REQUEST_METHOD'];

// ===== ROUTING =====
// GET /asztalok
if ($method === 'GET' && $path === '/asztalok') {
    (new AsztalController())->index();
    exit;
}

// POST /foglalas
if ($method === 'POST' && $path === '/foglalas') {
    (new FoglalasController())->store();
    exit;
}

// POST /vendeg/register
if ($method === 'POST' && $path === '/vendeg/register') {
    (new VendegController())->register();
    exit;
}

// POST /vendeg/login
if ($method === 'POST' && $path === '/vendeg/login') {
    (new VendegController())->login();
    exit;
}

// POST /admin/login
if ($method === 'POST' && $path === '/admin/login') {
    (new AdminController())->login();
    exit;
}

// GET /asztalok/szabad
if ($method === 'GET' && $path === '/asztalok/szabad') {
    (new AsztalController())->szabad();
    exit;
}


// GET /vendeg/profil
if ($method === 'GET' && $path === '/vendeg/profil') {
    (new VendegController())->profil();
    exit;
}

// GET /foglalas/sajat
if ($method === 'GET' && $path === '/foglalas/sajat') {
    (new FoglalasController())->sajat();
    exit;
}

// GET /foglalas/foglalt
if ($method === 'GET' && $path === '/foglalas/foglalt') {
    (new FoglalasController())->foglalt();
    exit;
}


// PUT /vendeg/update
if ($method === 'PUT' && $path === '/vendeg/update') {
    (new VendegController())->update();
    exit;
}


// GET /admin/vendegek
if ($method === 'GET' && $path === '/admin/vendegek') {
    (new AdminController())->vendegek();
    exit;
}

// GET /admin/foglalasok
if ($method === 'GET' && $path === '/admin/foglalasok') {
    (new AdminController())->foglalasok();
    exit;
}

// ===== HA NINCS ILYEN VÉGPONT =====
http_response_code(404);
echo json_encode([
    "error" => "Nincs ilyen végpont",
    "path" => $path,
    "method" => $method
        
]);

// index.php
if ($method === 'DELETE' && preg_match('#^/foglalas/(\d+)$#', $path, $matches)) {
    (new FoglalasController())->delete($matches[1]);
    exit;
}
