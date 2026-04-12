<?php

require_once __DIR__ . '/../Core/Database.php';
require_once __DIR__ . '/../Core/Response.php';
require_once __DIR__ . '/../../config.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AdminController {

    private $pdo;

    public function __construct() {
        $this->pdo = (new Database())->connect();
    }

    // ============================
    // ADMIN LOGIN
    // ============================
    public function login() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['email'], $data['jelszo'])) {
            Response::error("Hiányzó adat", 400);
        }

        try {
            $stmt = $this->pdo->prepare("SELECT * FROM admin WHERE email = ?");
            $stmt->execute([$data['email']]);
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$admin || !password_verify($data['jelszo'], $admin['jelszo'])) {
                Response::error("Hibás adatok", 401);
            }

            unset($admin['jelszo']);

            $payload = [
                "iss"      => "smarttable",
                "iat"      => time(),
                "exp"      => time() + 60 * 60 * 6,
                "admin_id" => $admin['admin_id'],
                "email"    => $admin['email'],
                "role"     => "admin"
            ];

            $token = JWT::encode($payload, JWT_SECRET, 'HS256');

            Response::success(["admin" => $admin, "token" => $token], "Sikeres admin belépés");

        } catch (Exception $e) {
            Response::error("Szerver hiba");
        }
    }

    // ============================
    // TOKEN ELLENŐRZÉS
    // ============================
    private function getToken() {
        $auth = null;

        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $auth = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        } else {
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $auth = $headers['Authorization'];
            }
        }

        if (!$auth) {
            Response::error("Nincs token", 401);
        }

        return str_replace("Bearer ", "", $auth);
    }

    private function checkAdminToken() {
        $token = $this->getToken();

        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));

            if ($decoded->role !== "admin") {
                Response::error("Nincs jogosultság", 403);
            }

            return $decoded;
        } catch (Exception $e) {
            Response::error("Érvénytelen token", 403);
        }
    }

    // ============================
    // ADMIN FOGLALÁSOK (VÉDETT)
    // ============================
    public function foglalasok() {
        $this->checkAdminToken();

        try {
            $stmt = $this->pdo->prepare("
                SELECT
                    f.foglalas_id,
                    f.datum,
                    f.idopont,
                    f.letszam,
                    v.nev,
                    v.email,
                    a.asztal_szam
                FROM foglalas f
                JOIN vendeg v ON f.vendeg_id = v.vendeg_id
                JOIN asztal a ON f.asztal_id = a.asztal_id
                ORDER BY f.datum DESC
            ");
            $stmt->execute();

            Response::success($stmt->fetchAll(PDO::FETCH_ASSOC));

        } catch (PDOException $e) {
            Response::error("Adatbázis hiba");
        }
    }

    // ============================
    // ADMIN – VENDÉGEK (tárolt eljárás)
    // ============================
    public function vendegek() {
        $this->checkAdminToken();

        try {
            // getAllVendeg tárolt eljárás
            $stmt = $this->pdo->prepare("CALL getAllVendeg()");
            $stmt->execute();

            Response::success($stmt->fetchAll(PDO::FETCH_ASSOC));

        } catch (Exception $e) {
            Response::error("Nem sikerült lekérni a vendégeket");
        }
    }
}