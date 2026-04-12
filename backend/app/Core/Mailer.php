<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer {

    // =============================================
    // ALAP KÜLDŐ
    // =============================================
    public static function send(string $to, string $subject, string $body): void {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = $_ENV['MAIL_HOST']      ?? 'smtp-relay.brevo.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = $_ENV['MAIL_USERNAME']   ?? '';
            $mail->Password   = $_ENV['MAIL_PASSWORD']   ?? '';
            $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'] ?? 'tls';
            $mail->Port       = $_ENV['MAIL_PORT']       ?? 587;
            $mail->CharSet    = 'UTF-8';

            $mail->setFrom(
                $_ENV['MAIL_FROM_ADDRESS'] ?? 'noreply@smarttable.hu',
                $_ENV['MAIL_FROM_NAME']    ?? 'SmartTable'
            );
            $mail->addAddress($to);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;

            $mail->send();

        } catch (Exception $e) {
            error_log("Mailer hiba: " . $mail->ErrorInfo);
        }
    }

    // =============================================
    // KÖZÖS FEJLÉC + LÁBLÉC
    // =============================================
    private static function layout(string $content, string $accentColor = '#facc15'): string {
        return "<!DOCTYPE html>
<html lang='hu'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>SmartTable</title>
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
                      🍽&nbsp; SmartTable
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
                © 2026 SmartTable. Minden jog fenntartva.
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

    // =============================================
    // ÜDVÖZLŐ EMAIL (regisztráció után)
    // =============================================
    public static function sendWelcome(string $to, string $nev): void {
        $content = "
        <h2 style='color:#0b1c4d; margin-top:0; font-size:24px;'>Üdvözöljük, {$nev}! 👋</h2>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Örömmel értesítjük, hogy regisztrációja sikeresen megtörtént a <strong style='color:#0b1c4d;'>SmartTable</strong> rendszerébe.
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
              <a href='http://localhost:5173/foglalas'
                 style='color:#facc15; text-decoration:none; font-weight:bold; font-size:15px;'>
                Asztal foglalása most →
              </a>
            </td>
          </tr>
        </table>

        <p style='color:#999; font-size:13px; margin-top:30px;'>
            Ha nem Ön regisztrált, hagyja figyelmen kívül ezt az emailt.
        </p>";

        self::send($to, "Üdvözöljük a SmartTable-ben, {$nev}!", self::layout($content));
    }

    // =============================================
    // FOGLALÁS VISSZAIGAZOLÁS
    // =============================================
    public static function sendFoglalasVisszaigazolas(
        string $to,
        string $nev,
        string $datum,
        string $idopont,
        int    $letszam,
        int    $asztal_szam
    ): void {
        $content = "
        <h2 style='color:#0b1c4d; margin-top:0; font-size:24px;'>Foglalása visszaigazolva! ✅</h2>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Kedves <strong style='color:#0b1c4d;'>{$nev}</strong>,
        </p>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Foglalását sikeresen rögzítettük. Az alábbiakban találja a foglalás részleteit:
        </p>

        <!-- ADATOK TÁBLÁZAT -->
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

        <p style='color:#555; font-size:15px; margin-top:24px;'>
            Szeretettel várjuk! 🤝
        </p>";

        self::send($to, "Foglalás visszaigazolása – {$datum} {$idopont}", self::layout($content));
    }

    // =============================================
    // FOGLALÁS TÖRLÉS ÉRTESÍTŐ
    // =============================================
    public static function sendFoglalasTorles(
        string $to,
        string $nev,
        string $datum,
        string $idopont
    ): void {
        $content = "
        <h2 style='color:#c0392b; margin-top:0; font-size:24px;'>Foglalása törölve ❌</h2>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Kedves <strong style='color:#0b1c4d;'>{$nev}</strong>,
        </p>

        <p style='color:#555; line-height:1.8; font-size:15px;'>
            Értesítjük, hogy az alábbi foglalását sikeresen töröltük rendszerünkből:
        </p>

        <!-- ADATOK TÁBLÁZAT -->
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
              <a href='http://localhost:5173/foglalas'
                 style='color:#facc15; text-decoration:none; font-weight:bold; font-size:15px;'>
                Új foglalás →
              </a>
            </td>
          </tr>
        </table>

        <p style='color:#999; font-size:13px; margin-top:30px;'>
            Ha nem Ön kezdeményezte a törlést, kérjük lépjen kapcsolatba velünk.
        </p>";

        self::send($to, "Foglalása törölve – SmartTable", self::layout($content, '#e74c3c'));
    }
}