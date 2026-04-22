<?php

require_once __DIR__ . '/../../vendor/PHPMailer/phpmailer/src/Exception.php';
require_once __DIR__ . '/../../vendor/PHPMailer/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../../vendor/PHPMailer/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer {

    private const SITE_URL = 'https://smarttables.hu';

    public static function send(string $to, string $subject, string $body): void {
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: SmartTables <info@smarttables.hu>\r\n";

        $result = mail($to, $subject, $body, $headers);

        if (!$result) {
            error_log("Mailer hiba: mail() function failed - to: {$to}");
        }
    }

    private static function layout(string $content, string $accentColor = '#facc15'): string {
        return "<!DOCTYPE html>
<html lang='hu'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>SmartTables</title>
</head>
<body style='margin:0; padding:0; background:#f0f2f5; font-family: Arial, Helvetica, sans-serif;'>

  <table width='100%' cellpadding='0' cellspacing='0' style='background:#f0f2f5; padding: 40px 20px;'>
    <tr>
      <td align='center'>
        <table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10);'>

          <!-- FEJLÉC -->
          <tr>
            <td style='background:#0b1c4d; padding: 28px 40px;'>
              <table width='100%' cellpadding='0' cellspacing='0'>
                <tr>
                  <td>
                    <span style='font-size:26px; font-weight:bold; color:{$accentColor}; letter-spacing:1px;'>
                      🍽&nbsp; SmartTables
                    </span>
                  </td>
                  <td align='right'>
                    <span style='color:rgba(255,255,255,0.5); font-size:12px;'>Éttermi asztalfoglaló rendszer</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- TARTALOM -->
          <tr>
            <td style='padding: 40px;'>
              {$content}
            </td>
          </tr>

          <!-- ELVÁLASZTÓ -->
          <tr>
            <td style='padding: 0 40px;'>
              <hr style='border:none; border-top:1px solid #eee; margin:0;'>
            </td>
          </tr>

          <!-- LÁBLÉC -->
          <tr>
            <td style='padding: 20px 40px; text-align:center;'>
              <p style='color:#aaa; font-size:12px; margin:0;'>
                Ez egy automatikus értesítő – kérjük, ne válaszoljon erre az emailre.<br>
                © 2026 SmartTables. Minden jog fenntartva.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>";
    }

    public static function sendWelcome(string $to, string $nev): void {
        $siteUrl = self::SITE_URL;
        $content = "
        <h2 style='color:#0b1c4d; margin-top:0; font-size:24px;'>Üdvözöljük, {$nev}! 👋</h2>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Örömmel értesítjük, hogy regisztrációja sikeresen megtörtént a <strong style='color:#0b1c4d;'>SmartTables</strong> rendszerébe.
        </p>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Mostantól egyszerűen és gyorsan foglalhat asztalt éttermünkben – akár percek alatt!
        </p>

        <table width='100%' cellpadding='0' cellspacing='0' style='margin: 30px 0;'>
          <tr>
            <td style='background:#f8f9ff; border-radius:12px; padding:20px;'>
              <table width='100%' cellpadding='0' cellspacing='0'>
                <tr>
                  <td style='padding:8px 0; color:#555; font-size:14px;'>✅&nbsp; <strong>Ingyenes regisztráció</strong></td>
                </tr>
                <tr>
                  <td style='padding:8px 0; color:#555; font-size:14px;'>📅&nbsp; <strong>Valós idejű asztalfoglalás</strong></td>
                </tr>
                <tr>
                  <td style='padding:8px 0; color:#555; font-size:14px;'>🔔&nbsp; <strong>Automatikus értesítők</strong></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table cellpadding='0' cellspacing='0'>
          <tr>
            <td style='background:#0b1c4d; border-radius:10px; padding:14px 28px;'>
              <a href='{$siteUrl}/foglalas'
                 style='color:#facc15; text-decoration:none; font-weight:bold; font-size:15px;'>
                Asztal foglalása most →
              </a>
            </td>
          </tr>
        </table>

        <p style='color:#999; font-size:13px; margin-top:30px;'>
            Ha nem Ön regisztrált, hagyja figyelmen kívül ezt az emailt.
        </p>";

        self::send($to, "Üdvözöljük a SmartTables-ben, {$nev}!", self::layout($content));
    }

    public static function sendFoglalasVisszaigazolas(
            string $to,
            string $nev,
            string $datum,
            string $idopont,
            int $letszam,
            int $asztal_szam
    ): void {
        $siteUrl = self::SITE_URL;
        $content = "
        <h2 style='color:#0b1c4d; margin-top:0; font-size:24px;'>Foglalása visszaigazolva! ✅</h2>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Kedves <strong style='color:#0b1c4d;'>{$nev}</strong>,
        </p>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Foglalását sikeresen rögzítettük. Az alábbiakban találja a foglalás részleteit:
        </p>

        <table width='100%' cellpadding='0' cellspacing='0' style='margin: 24px 0; border-radius:12px; overflow:hidden; border:1px solid #e8eaf0;'>
          <tr style='background:#0b1c4d;'>
            <td colspan='2' style='padding:14px 20px; color:#facc15; font-weight:bold; font-size:14px; letter-spacing:0.5px;'>
              FOGLALÁS ADATAI
            </td>
          </tr>
          <tr style='background:#f8f9ff;'>
            <td style='padding:14px 20px; color:#888; font-size:14px; width:40%;'>📅 Dátum</td>
            <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$datum}</td>
          </tr>
          <tr style='background:#ffffff;'>
            <td style='padding:14px 20px; color:#888; font-size:14px;'>⏰ Időpont</td>
            <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$idopont}</td>
          </tr>
          <tr style='background:#f8f9ff;'>
            <td style='padding:14px 20px; color:#888; font-size:14px;'>👥 Létszám</td>
            <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$letszam} fő</td>
          </tr>
          <tr style='background:#ffffff;'>
            <td style='padding:14px 20px; color:#888; font-size:14px;'>🍽 Asztal</td>
            <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$asztal_szam}. asztal</td>
          </tr>
        </table>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Ha módosítani vagy törölni szeretné foglalását, azt bármikor megteheti profilja oldalán.
        </p>

        <table cellpadding='0' cellspacing='0' style='margin-top:16px;'>
          <tr>
            <td style='background:#0b1c4d; border-radius:10px; padding:14px 28px;'>
              <a href='{$siteUrl}/profil'
                 style='color:#facc15; text-decoration:none; font-weight:bold; font-size:15px;'>
                Saját foglalásaim →
              </a>
            </td>
          </tr>
        </table>

        <p style='color:#555; font-size:15px; margin-top:24px;'>
            Szeretettel várjuk! 🤝
        </p>";

        self::send($to, "Foglalás visszaigazolása – {$datum} {$idopont}", self::layout($content));
    }

    public static function sendFoglalasTorles(
            string $to,
            string $nev,
            string $datum,
            string $idopont
    ): void {
        $siteUrl = self::SITE_URL;
        $content = "
        <h2 style='color:#c0392b; margin-top:0; font-size:24px;'>Foglalása törölve ❌</h2>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Kedves <strong style='color:#0b1c4d;'>{$nev}</strong>,
        </p>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Értesítjük, hogy az alábbi foglalását sikeresen töröltük rendszerünkből:
        </p>

        <table width='100%' cellpadding='0' cellspacing='0' style='margin: 24px 0; border-radius:12px; overflow:hidden; border:1px solid #fde8e8;'>
          <tr style='background:#c0392b;'>
            <td colspan='2' style='padding:14px 20px; color:#fff; font-weight:bold; font-size:14px; letter-spacing:0.5px;'>
              TÖRÖLT FOGLALÁS ADATAI
            </td>
          </tr>
          <tr style='background:#fff8f8;'>
            <td style='padding:14px 20px; color:#888; font-size:14px; width:40%;'>📅 Dátum</td>
            <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$datum}</td>
          </tr>
          <tr style='background:#ffffff;'>
            <td style='padding:14px 20px; color:#888; font-size:14px;'>⏰ Időpont</td>
            <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$idopont}</td>
          </tr>
        </table>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Ha ez tévedés volt, vagy szeretne újra foglalni, az alábbi gombra kattintva megteheti:
        </p>

        <table cellpadding='0' cellspacing='0' style='margin-top:16px;'>
          <tr>
            <td style='background:#0b1c4d; border-radius:10px; padding:14px 28px;'>
              <a href='{$siteUrl}/foglalas'
                 style='color:#facc15; text-decoration:none; font-weight:bold; font-size:15px;'>
                Új foglalás →
              </a>
            </td>
          </tr>
        </table>

        <p style='color:#999; font-size:13px; margin-top:30px;'>
            Ha nem Ön kezdeményezte a törlést, kérjük lépjen kapcsolatba velünk.
        </p>";

        self::send($to, "Foglalása törölve – SmartTables", self::layout($content, '#e74c3c'));
    }

    public static function sendAdminUjFoglalas(
            string $vendeg_nev,
            string $vendeg_email,
            string $datum,
            string $idopont,
            int $letszam,
            int $asztal_szam,
            ?string $megjegyzes = null
    ): void {
        $siteUrl = self::SITE_URL;
        $adminEmail = $_ENV['ADMIN_EMAIL'] ?? 'info@smarttables.hu';

        $megjegyzesSor = $megjegyzes ? "<tr style='background:#f8f9ff;'>
                <td style='padding:14px 20px; color:#888; font-size:14px; width:40%;'>💬 Megjegyzés</td>
                <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$megjegyzes}</td>
               </tr>" : "";

        $content = "
        <h2 style='color:#0b1c4d; margin-top:0; font-size:24px;'>Új foglalás érkezett! 🔔</h2>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Egy új asztalfoglalás érkezett a SmartTables rendszerbe. Az alábbiakban találja a részleteket:
        </p>

        <table width='100%' cellpadding='0' cellspacing='0' style='margin: 24px 0; border-radius:12px; overflow:hidden; border:1px solid #e8eaf0;'>
          <tr style='background:#0b1c4d;'>
            <td colspan='2' style='padding:14px 20px; color:#facc15; font-weight:bold; font-size:14px; letter-spacing:0.5px;'>
              ÚJ FOGLALÁS ADATAI
            </td>
          </tr>
          <tr style='background:#f8f9ff;'>
            <td style='padding:14px 20px; color:#888; font-size:14px; width:40%;'>👤 Vendég neve</td>
            <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$vendeg_nev}</td>
          </tr>
          <tr style='background:#ffffff;'>
            <td style='padding:14px 20px; color:#888; font-size:14px;'>📧 Email</td>
            <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$vendeg_email}</td>
          </tr>
          <tr style='background:#f8f9ff;'>
            <td style='padding:14px 20px; color:#888; font-size:14px;'>📅 Dátum</td>
            <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$datum}</td>
          </tr>
          <tr style='background:#ffffff;'>
            <td style='padding:14px 20px; color:#888; font-size:14px;'>⏰ Időpont</td>
            <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$idopont}</td>
          </tr>
          <tr style='background:#f8f9ff;'>
            <td style='padding:14px 20px; color:#888; font-size:14px;'>👥 Létszám</td>
            <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$letszam} fő</td>
          </tr>
          <tr style='background:#ffffff;'>
            <td style='padding:14px 20px; color:#888; font-size:14px;'>🍽 Asztal</td>
            <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$asztal_szam}. asztal</td>
          </tr>
          {$megjegyzesSor}
        </table>

        <table cellpadding='0' cellspacing='0' style='margin-top:16px;'>
          <tr>
            <td style='background:#0b1c4d; border-radius:10px; padding:14px 28px;'>
              <a href='{$siteUrl}/admin'
                 style='color:#facc15; text-decoration:none; font-weight:bold; font-size:15px;'>
                Admin panel megnyitása →
              </a>
            </td>
          </tr>
        </table>";

        self::send($adminEmail, "🔔 Új foglalás – {$vendeg_nev} – {$datum} {$idopont}", self::layout($content));
    }

    public static function sendTiltasErtesito(string $to, string $nev): void {
        $siteUrl = self::SITE_URL;
        $content = "
    <h2 style='color:#c0392b; margin-top:0; font-size:24px;'>Fiókja le lett tiltva ⛔</h2>

    <p style='color:#555; line-height:1.8; font-size:15px;'>
        Kedves <strong style='color:#0b1c4d;'>{$nev}</strong>,
    </p>

    <p style='color:#555; line-height:1.8; font-size:15px;'>
        Értesítjük, hogy fiókját az étterem adminisztrátora letiltotta.<br>
        Amíg a tiltás érvényben van, nem tud bejelentkezni és asztalt foglalni.
    </p>

    <p style='color:#555; line-height:1.8; font-size:15px;'>
        Ha úgy gondolja, hogy ez tévedés, kérjük lépjen kapcsolatba velünk:
    </p>

    <table cellpadding='0' cellspacing='0' style='margin-top:16px;'>
      <tr>
        <td style='background:#0b1c4d; border-radius:10px; padding:14px 28px;'>
          <a href='{$siteUrl}/kapcsolat'
             style='color:#facc15; text-decoration:none; font-weight:bold; font-size:15px;'>
            Kapcsolatfelvétel →
          </a>
        </td>
      </tr>
    </table>

    <p style='color:#999; font-size:13px; margin-top:30px;'>
        Ha a tiltás feloldásra kerül, újra bejelentkezhet fiókjába.
    </p>";

        self::send($to, "Fiókja le lett tiltva – SmartTables", self::layout($content, '#e74c3c'));
    }

    public static function sendFeloldasErtesito(string $to, string $nev): void {
        $siteUrl = self::SITE_URL;
        $content = "
    <h2 style='color:#0b1c4d; margin-top:0; font-size:24px;'>Fiókja feloldva! ✅</h2>

    <p style='color:#555; line-height:1.8; font-size:15px;'>
        Kedves <strong style='color:#0b1c4d;'>{$nev}</strong>,
    </p>

    <p style='color:#555; line-height:1.8; font-size:15px;'>
        Értesítjük, hogy fiókjának tiltása feloldásra került.<br>
        Mostantól újra bejelentkezhet és asztalt foglalhat.
    </p>

    <table cellpadding='0' cellspacing='0' style='margin-top:16px;'>
      <tr>
        <td style='background:#0b1c4d; border-radius:10px; padding:14px 28px;'>
          <a href='{$siteUrl}/login'
             style='color:#facc15; text-decoration:none; font-weight:bold; font-size:15px;'>
            Bejelentkezés →
          </a>
        </td>
      </tr>
    </table>";

        self::send($to, "Fiókja feloldva – SmartTables", self::layout($content));
    }

    public static function sendKapcsolatUzenet(string $nev, string $email, string $uzenet): void {
        $adminEmail = $_ENV['ADMIN_EMAIL'] ?? 'info@smarttables.hu';
        $siteUrl = self::SITE_URL;
        $content = "
    <h2 style='color:#0b1c4d; margin-top:0; font-size:24px;'>Új kapcsolatfelvételi üzenet ✉️</h2>
    <table width='100%' cellpadding='0' cellspacing='0' style='margin: 24px 0; border-radius:12px; overflow:hidden; border:1px solid #e8eaf0;'>
      <tr style='background:#0b1c4d;'>
        <td colspan='2' style='padding:14px 20px; color:#facc15; font-weight:bold; font-size:14px;'>ÜZENET ADATAI</td>
      </tr>
      <tr style='background:#f8f9ff;'>
        <td style='padding:14px 20px; color:#888; font-size:14px; width:30%;'>👤 Név</td>
        <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$nev}</td>
      </tr>
      <tr style='background:#ffffff;'>
        <td style='padding:14px 20px; color:#888; font-size:14px;'>📧 Email</td>
        <td style='padding:14px 20px; color:#222; font-weight:bold; font-size:14px;'>{$email}</td>
      </tr>
      <tr style='background:#f8f9ff;'>
        <td style='padding:14px 20px; color:#888; font-size:14px;'>💬 Üzenet</td>
        <td style='padding:14px 20px; color:#222; font-size:14px;'>{$uzenet}</td>
      </tr>
    </table>";
        self::send($adminEmail, "✉️ Új üzenet – {$nev}", self::layout($content));
    }
}
