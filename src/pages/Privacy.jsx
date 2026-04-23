import "../styles/privacy.css";

export default function Privacy() {
  return (
    <div className="privacy-container">
      <h1>Adatvédelmi Nyilatkozat</h1>
      <p className="privacy-subtitle">Hatályos: 2026. január 1-től</p>

      <h2>1. Adatkezelő</h2>
      <p>SmartTables Étterem | info@smarttables.hu | smarttables.hu</p>

      <h2>2. Kezelt adatok</h2>
      <p>Regisztráció során: teljes név, email cím, jelszó (bcrypt titkosítással tárolva).</p>
      <p>Foglaláskor: dátum, időpont, létszám, opcionális megjegyzés.</p>

      <h2>3. Adatkezelés célja és jogalapja</h2>
      <p>Az adatokat kizárólag az asztalfoglalási szolgáltatás nyújtásához használjuk. Jogalap: az érintett hozzájárulása (GDPR 6. cikk (1) a) pont).</p>

      <h2>4. Adatok megőrzése</h2>
      <p>A regisztrációs adatokat a felhasználó törlési kérelméig tároljuk. A foglalási adatokat 1 évig őrizzük meg.</p>

      <h2>5. Felhasználói jogok</h2>
      <p>Ön jogosult hozzáférni, módosítani vagy törölni személyes adatait. Kérését az info@smarttables.hu címre küldheti.</p>

      <h2>6. Sütik</h2>
      <p>Az oldal localStorage-t használ a bejelentkezési állapot megőrzéséhez. Harmadik fél sütiket nem alkalmazunk.</p>

      <h2>7. Biztonság</h2>
      <p>Az adatokat HTTPS kapcsolaton keresztül továbbítjuk. A jelszavak bcrypt algoritmussal titkosítva tárolódnak. A JWT tokenek 1 óra után lejárnak.</p>

      <h2>8. Kapcsolat</h2>
      <p>Adatvédelmi kérdésekkel: <a href="mailto:info@smarttables.hu">info@smarttables.hu</a></p>
    </div>
  );
}