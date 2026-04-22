<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class VendegController {

    private $pdo;
    private $secret_key = JWT_SECRET;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->connect();
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"), true);

        $nev     = trim($data['nev'] ?? '');
        $email   = trim($data['email'] ?? '');
        $jelszo  = $data['jelszo'] ?? '';
        $telefon = $data['telefon'] ?? null;

        if (mb_strlen($nev) < 2) {
            echo json_encode(["success" => false, "message" => "A név legalább 2 karakter legyen."]);
            return;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["success" => false, "message" => "Érvénytelen email cím."]);
            return;
        }
        if (strlen($jelszo) < 6) {
            echo json_encode(["success" => false, "message" => "A jelszó legalább 6 karakter legyen."]);
            return;
        }

        $stmt = $this->pdo->prepare("SELECT vendeg_id FROM vendeg WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(["success" => false, "message" => "Ez az email cím már foglalt."]);
            return;
        }

        $hash = password_hash($jelszo, PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare("CALL insertVendeg(?, ?, ?, ?)");
        $stmt->execute([$nev, $email, $hash, $telefon]);

        Mailer::sendWelcome($email, $nev);

        echo json_encode(["success" => true]);
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"), true);

        $email  = $data['email'] ?? '';
        $jelszo = $data['jelszo'] ?? '';

        $stmt = $this->pdo->prepare("SELECT * FROM vendeg WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($jelszo, $user['jelszo'])) {
            echo json_encode(["success" => false, "message" => "Hibás adatok"]);
            return;
        }

        if (!empty($user['tiltott']) && $user['tiltott'] == 1) {
            echo json_encode(["success" => false, "message" => "Fiókja le van tiltva. Kérjük, lépjen kapcsolatba az étteremmel."]);
            return;
        }

        $naplo = $this->pdo->prepare(
            "INSERT INTO bejelentkezes_naplo (vendeg_id) VALUES (?)"
        );
        $naplo->execute([$user['vendeg_id']]);

        $payload = [
            "id"    => $user['vendeg_id'],
            "email" => $user['email'],
            "exp"   => time() + 3600
        ];

        $token = JWT::encode($payload, $this->secret_key, 'HS256');
        echo json_encode(["success" => true, "token" => $token]);
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

    public function profil() {
        $userId = $this->getUserIdFromToken();
        if (!$userId) {
            echo json_encode(["success" => false, "message" => "Invalid token"]);
            return;
        }

        $stmt = $this->pdo->prepare(
            "SELECT vendeg_id, nev, email, telefon FROM vendeg WHERE vendeg_id = ?"
        );
        $stmt->execute([$userId]);
        echo json_encode(["success" => true, "data" => $stmt->fetch(PDO::FETCH_ASSOC)]);
    }

    public function update() {
        $userId = $this->getUserIdFromToken();
        if (!$userId) {
            echo json_encode(["success" => false]);
            return;
        }

        $data    = json_decode(file_get_contents("php://input"), true);
        $nev     = $data['nev'] ?? '';
        $email   = $data['email'] ?? '';
        $telefon = $data['telefon'] ?? '';

        $stmt = $this->pdo->prepare("CALL updateVendeg(?, ?, ?)");
        $stmt->execute([$userId, $nev, $email]);

        $stmt2 = $this->pdo->prepare("UPDATE vendeg SET telefon = ? WHERE vendeg_id = ?");
        $stmt2->execute([$telefon, $userId]);

        echo json_encode(["success" => true, "message" => "Frissítve"]);
    }

    public function jelszoValtas() {
        $userId = $this->getUserIdFromToken();
        if (!$userId) {
            echo json_encode(["success" => false, "message" => "Érvénytelen token"]);
            return;
        }

        $data        = json_decode(file_get_contents("php://input"), true);
        $regiJelszo  = $data['regi_jelszo'] ?? '';
        $ujJelszo    = $data['uj_jelszo']   ?? '';

        if (!$regiJelszo || !$ujJelszo) {
            echo json_encode(["success" => false, "message" => "Hiányzó adatok"]);
            return;
        }

        if (strlen($ujJelszo) < 6) {
            echo json_encode(["success" => false, "message" => "Az új jelszó legalább 6 karakter legyen!"]);
            return;
        }

        $stmt = $this->pdo->prepare("SELECT jelszo FROM vendeg WHERE vendeg_id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($regiJelszo, $user['jelszo'])) {
            echo json_encode(["success" => false, "message" => "A jelenlegi jelszó helytelen!"]);
            return;
        }

        $hash = password_hash($ujJelszo, PASSWORD_DEFAULT);
        $update = $this->pdo->prepare("UPDATE vendeg SET jelszo = ? WHERE vendeg_id = ?");
        $update->execute([$hash, $userId]);

        echo json_encode(["success" => true, "message" => "Jelszó sikeresen megváltoztatva!"]);
    }
}