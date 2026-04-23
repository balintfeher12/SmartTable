import { useState } from "react";
import "../styles/contact.css";

const API = "http://localhost:8888/Backendd/index.php";

export default function Kapcsolat() {
  const [nev, setNev] = useState("");
  const [email, setEmail] = useState("");
  const [uzenet, setUzenet] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSuccess(""); setError("");
    if (!nev || !email || !uzenet) { setError("Minden mezőt ki kell tölteni!"); return; }
    try {
      const res = await fetch(`${API}/kapcsolat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nev, email, uzenet })
      });
      const d = await res.json();
      if (d.success) {
        setSuccess("✅ Üzenet elküldve! Hamarosan felvesszük a kapcsolatot.");
        setNev(""); setEmail(""); setUzenet("");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError("❌ Hiba történt. Kérjük próbálja újra.");
      }
    } catch {
      setError("❌ Hálózati hiba");
    }
  };

  return (
    <div className="kapcsolat-page">
      <div className="kapcsolat-card">

        <h1>📞 Kapcsolat</h1>
        <p>Vegye fel velünk a kapcsolatot bármilyen kérdés esetén.</p>

        <div className="kapcsolat-item">
          <strong>📧 Email</strong>
          info@smarttable.hu
        </div>
        <div className="kapcsolat-item">
          <strong>📞 Telefon</strong>
          +36 30 123 4567
        </div>
        <div className="kapcsolat-item">
          <strong>📍 Cím</strong>
          7621 Pécs, Fő utca 1.
        </div>

        <h2 style={{ marginTop: 32, color: "#facc15" }}>✉️ Üzenet küldése</h2>

        <div className="kapcsolat-form">
          <input
            type="text"
            placeholder="Neve"
            value={nev}
            onChange={e => setNev(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email cím"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Üzenete..."
            value={uzenet}
            onChange={e => setUzenet(e.target.value)}
            rows={5}
          />
          <button onClick={handleSubmit}>📤 Küldés</button>
        </div>

        {success && <p className="success-msg">{success}</p>}
        {error   && <p className="error-msg">{error}</p>}

      </div>
    </div>
  );
}