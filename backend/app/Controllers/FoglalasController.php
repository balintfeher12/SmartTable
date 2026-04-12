<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class FoglalasController {

    private $pdo;
    private $secret_key = JWT_SECRET;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->connect();
    }

    private function getUserIdFromToken() {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;
        if (!$auth) return null;

        $token = str_replace("Bearer ", "", $auth);
        try {
            $decoded = JWT::decode($token, new Key($this->secret_key, 'HS256'));
            return $decoded->id;
        } catch (Exception $e) {
            return null;
        }
    }

    public function sajat() {
        $userId = $this->getUserIdFromToken();
        if (!$userId) {
            echo json_encode(["success" => false]);
            return;
        }

        $stmt = $this->pdo->prepare("
            SELECT f.*, a.asztal_szam
            FROM foglalas f
            JOIN asztal a ON f.asztal_id = a.asztal_id
            WHERE f.vendeg_id = ?
        ");
        $stmt->execute([$userId]);

        echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    // =============================================
    // FOGLALÁS LÉTREHOZÁS + visszaigazoló email
    // =============================================
    public function store() {
        $data = json_decode(file_get_contents("php://input"), true);

        $datum     = $data['datum']     ?? null;
        $idopont   = $data['idopont']   ?? null;
        $letszam   = $data['letszam']   ?? null;
        $asztal_id = $data['asztal_id'] ?? null;

        if (!$datum || !$idopont || !$letszam || !$asztal_id) {
            echo json_encode(["success" => false, "message" => "Hiányzó adatok"]);
            return;
        }

        $userId = $this->getUserIdFromToken();

        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO foglalas (vendeg_id, datum, idopont, letszam, asztal_id)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$userId, $datum, $idopont, $letszam, $asztal_id]);

            // vendég + asztal adatok az emailhez
            if ($userId) {
                $v = $this->pdo->prepare("SELECT nev, email FROM vendeg WHERE vendeg_id = ?");
                $v->execute([$userId]);
                $vendeg = $v->fetch(PDO::FETCH_ASSOC);

                $a = $this->pdo->prepare("SELECT asztal_szam FROM asztal WHERE asztal_id = ?");
                $a->execute([$asztal_id]);
                $asztal = $a->fetch(PDO::FETCH_ASSOC);

                if ($vendeg && $asztal) {
                    Mailer::sendFoglalasVisszaigazolas(
                        $vendeg['email'],
                        $vendeg['nev'],
                        $datum,
                        $idopont,
                        (int) $letszam,
                        (int) $asztal['asztal_szam']
                    );
                }
            }

            echo json_encode(["success" => true, "message" => "Foglalás sikeres"]);

        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    }

    public function foglalt() {
        $datum   = $_GET['datum']   ?? null;
        $idopont = $_GET['idopont'] ?? null;

        if (!$datum || !$idopont) {
            echo json_encode(["success" => false, "message" => "Hiányzó paraméterek"]);
            return;
        }

        $stmt = $this->pdo->prepare("
            SELECT asztal_id FROM foglalas
            WHERE datum = ? AND idopont = ? AND statusz = 'aktiv'
        ");
        $stmt->execute([$datum, $idopont]);
        $ids = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'asztal_id');

        echo json_encode(["success" => true, "data" => $ids]);
    }

    // =============================================
    // FOGLALÁS TÖRLÉS + értesítő email
    // =============================================
    public function delete($id) {
        try {
            // adatok lekérése email előtt
            $stmt = $this->pdo->prepare("
                SELECT f.datum, f.idopont, v.nev, v.email
                FROM foglalas f
                JOIN vendeg v ON f.vendeg_id = v.vendeg_id
                WHERE f.foglalas_id = ?
            ");
            $stmt->execute([$id]);
            $foglalas = $stmt->fetch(PDO::FETCH_ASSOC);

            // tárolt eljárás törli a foglalást és felszabadítja az asztalt
            $del = $this->pdo->prepare("CALL deleteFoglalas(?)");
            $del->execute([$id]);

            // törlés értesítő email
            if ($foglalas) {
                Mailer::sendFoglalasTorles(
                    $foglalas['email'],
                    $foglalas['nev'],
                    $foglalas['datum'],
                    $foglalas['idopont']
                );
            }

            echo json_encode(["success" => true]);

        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    }
}