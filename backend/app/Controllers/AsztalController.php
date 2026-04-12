<?php

require_once __DIR__ . '/../Core/Database.php';
require_once __DIR__ . '/../Core/Response.php';

class AsztalController {

    private $pdo;

    public function __construct() {
        $this->pdo = (new Database())->connect();
    }

    // GET /asztalok – összes asztal
    public function index() {
        try {
            $stmt = $this->pdo->query("SELECT * FROM asztal");
            Response::success($stmt->fetchAll(PDO::FETCH_ASSOC), "Asztalok sikeresen lekérdezve");

        } catch (PDOException $e) {
            Response::error("Adatbázis hiba történt");
        }
    }

    // GET /asztalok/szabad – szabad asztalok (datum + idopont alapján)
    public function szabad() {
        if (!isset($_GET['datum']) || !isset($_GET['idopont'])) {
            Response::error("Hiányzó dátum vagy időpont");
        }

        $datum   = $_GET['datum'];
        $idopont = $_GET['idopont'];

        // getSzabadAsztalok visszaadja a 'szabad' státuszú asztalokat,
        // majd kiszűrjük az adott időpontra már foglaltakat
        $stmt = $this->pdo->prepare("CALL getSzabadAsztalok()");
        $stmt->execute();
        $szabadAlapban = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // foglalt asztal ID-k az adott időpontra
        $stmt2 = $this->pdo->prepare("
            SELECT asztal_id FROM foglalas
            WHERE datum = ? AND idopont = ? AND statusz = 'aktiv'
        ");
        $stmt2->execute([$datum, $idopont]);
        $foglaltIds = array_column($stmt2->fetchAll(PDO::FETCH_ASSOC), 'asztal_id');

        // kiszűrjük a foglaltakat
        $eredmeny = array_filter($szabadAlapban, function ($a) use ($foglaltIds) {
            return !in_array($a['asztal_id'], $foglaltIds);
        });

        Response::success(array_values($eredmeny));
    }
}