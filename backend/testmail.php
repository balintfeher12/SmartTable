<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/app/Core/Mailer.php';

// === TESZT EMAIL KÜLDÉS ===
// Írd át a saját email címedre!
$testEmail = "balintfeher607@gmail.com";

echo "1) Üdvözlő email teszt...<br>";
Mailer::sendWelcome($testEmail, "Teszt Felhasználó");
echo "✅ sendWelcome elküldve<br><br>";

echo "2) Foglalás visszaigazolás teszt...<br>";
Mailer::sendFoglalasVisszaigazolas(
    $testEmail,
    "Teszt Felhasználó",
    "2026-05-10",
    "18:30",
    4,
    3
);
echo "✅ sendFoglalasVisszaigazolas elküldve<br><br>";

echo "3) Foglalás törlés teszt...<br>";
Mailer::sendFoglalasTorles(
    $testEmail,
    "Teszt Felhasználó",
    "2026-05-10",
    "18:30"
);
echo "✅ sendFoglalasTorles elküldve<br><br>";

echo "🎉 Minden teszt lefutott!";