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
    // ADMIN FOGLALÁSOK + SZŰRÉS
    // ============================
    public function foglalasok() {
        $this->checkAdminToken();

        $datum  = $_GET['datum']  ?? null;
        $nev    = $_GET['nev']    ?? null;

        try {
            $sql = "
                SELECT
                    f.foglalas_id,
                    f.datum,
                    f.idopont,
                    f.letszam,
                    f.megjegyzes,
                    f.statusz,
                    v.nev,
                    v.email,
                    a.asztal_szam
                FROM foglalas f
                JOIN vendeg v ON f.vendeg_id = v.vendeg_id
                JOIN asztal a ON f.asztal_id = a.asztal_id
                WHERE 1=1
            ";
            $params = [];

            if ($datum) {
                $sql .= " AND f.datum = ?";
                $params[] = $datum;
            }
            if ($nev) {
                $sql .= " AND v.nev LIKE ?";
                $params[] = "%" . $nev . "%";
            }

            $sql .= " ORDER BY f.datum DESC, f.idopont DESC";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);

            Response::success($stmt->fetchAll(PDO::FETCH_ASSOC));

        } catch (PDOException $e) {
            Response::error("Adatbázis hiba");
        }
    }

    // ============================
    // ADMIN – VENDÉGEK
    // ============================
    public function vendegek() {
        $this->checkAdminToken();

        try {
            $stmt = $this->pdo->prepare("CALL getAllVendeg()");
            $stmt->execute();

            Response::success($stmt->fetchAll(PDO::FETCH_ASSOC));

        } catch (Exception $e) {
            Response::error("Nem sikerült lekérni a vendégeket");
        }
    }

    // ============================
    // VENDÉG TILTÁSA / FELOLDÁSA
    // ============================
    public function tiltasToggle($vendeg_id) {
        $this->checkAdminToken();

        try {
            // Jelenlegi állapot lekérése
            $stmt = $this->pdo->prepare("SELECT tiltott FROM vendeg WHERE vendeg_id = ?");
            $stmt->execute([$vendeg_id]);
            $vendeg = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$vendeg) {
                Response::error("Vendég nem található", 404);
                return;
            }

            // Állapot megfordítása
            $ujAllapot = $vendeg['tiltott'] ? 0 : 1;

            $update = $this->pdo->prepare("UPDATE vendeg SET tiltott = ? WHERE vendeg_id = ?");
            $update->execute([$ujAllapot, $vendeg_id]);

            $uzenet = $ujAllapot ? "Vendég sikeresen letiltva." : "Vendég tiltása feloldva.";
            Response::success(["tiltott" => $ujAllapot], $uzenet);

        } catch (Exception $e) {
            Response::error("Hiba a tiltás során");
        }
    }

    // ============================
    // ASZTAL HOZZÁADÁSA
    // ============================
    public function asztalHozzaad() {
        $this->checkAdminToken();

        $data = json_decode(file_get_contents("php://input"), true);

        $asztal_szam = $data['asztal_szam'] ?? null;
        $ferohely    = $data['ferohely']    ?? null;
        $hely        = $data['hely']        ?? 'belter';

        if (!$asztal_szam || !$ferohely) {
            Response::error("Hiányzó adatok", 400);
            return;
        }

        try {
            // Ellenőrzés hogy a szám nem foglalt-e már
            $check = $this->pdo->prepare("SELECT asztal_id FROM asztal WHERE asztal_szam = ?");
            $check->execute([$asztal_szam]);
            if ($check->fetch()) {
                Response::error("Ez az asztalnév már létezik.", 409);
                return;
            }

            $stmt = $this->pdo->prepare(
                "INSERT INTO asztal (asztal_szam, ferohely, hely, statusz) VALUES (?, ?, ?, 'szabad')"
            );
            $stmt->execute([$asztal_szam, $ferohely, $hely]);

            Response::success(["asztal_id" => $this->pdo->lastInsertId()], "Asztal sikeresen hozzáadva.");

        } catch (Exception $e) {
            Response::error("Hiba az asztal hozzáadásakor");
        }
    }

    // ============================
    // ASZTAL TÖRLÉSE
    // ============================
    public function asztalTorol($asztal_id) {
        $this->checkAdminToken();

        try {
            $stmt = $this->pdo->prepare("DELETE FROM asztal WHERE asztal_id = ?");
            $stmt->execute([$asztal_id]);

            Response::success([], "Asztal törölve.");

        } catch (Exception $e) {
            Response::error("Hiba az asztal törlésekor — lehet aktív foglalás van rá.");
        }
    }
}