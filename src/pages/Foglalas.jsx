import { useEffect, useState } from "react";
import "../App.css";
import "../styles/foglalas.css";

const ASZTAL_FORMA = {
  1: "kerek", 2: "kerek", 3: "kerek",
  4: "kerek", 5: "teglalap", 6: "teglalap",
  7: "teglalap", 8: "teglalap", 9: "kerek",
  10: "kerek", 11: "teglalap", 12: "teglalap",
  13: "kerek", 14: "teglalap", 15: "teglalap",
};

function Szekek({ forma, ferohely }) {
  if (forma === "kerek") {
    const db = Math.min(ferohely, 8);
    return (
      <div className="szekek">
        {Array.from({ length: db }).map((_, i) => {
          const angle = (i / db) * 2 * Math.PI - Math.PI / 2;
          const r = 42;
          return (
            <span key={i} className="szek szek-kerek" style={{
              left: `calc(50% + ${Math.cos(angle) * r}px)`,
              top: `calc(50% + ${Math.sin(angle) * r}px)`
            }} />
          );
        })}
      </div>
    );
  }

  const oldalankent = Math.min(Math.ceil(ferohely / 2), 4);
  const topDb = Math.min(Math.ceil(ferohely / 2), oldalankent);
  const bottomDb = Math.min(Math.floor(ferohely / 2), oldalankent);

  return (
    <div className="szekek">
      {Array.from({ length: topDb }).map((_, i) => (
        <span key={`t${i}`} className="szek szek-teglalap szek-top"
          style={{ left: `${12 + i * 24}px` }} />
      ))}
      {Array.from({ length: bottomDb }).map((_, i) => (
        <span key={`b${i}`} className="szek szek-teglalap szek-bottom"
          style={{ left: `${12 + i * 24}px` }} />
      ))}
    </div>
  );
}

export default function Foglalas() {
  const [asztalok, setAsztalok] = useState([]);
  const [selectedAsztal, setSelectedAsztal] = useState(null);
  const [datum, setDatum] = useState("");
  const [idopont, setIdopont] = useState("");
  const [letszam, setLetszam] = useState("");
  const [megjegyzes, setMegjegyzes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [foglaltAsztalok, setFoglaltAsztalok] = useState([]);

  // Admin nem foglalhat
  const isAdmin = !!localStorage.getItem("admin");

  useEffect(() => {
    if (!datum || !idopont) return;
    fetch(`https://smarttables.hu/api/index.php/foglalas/foglalt?datum=${datum}&idopont=${idopont}`)
      .then(r => r.json()).then(d => setFoglaltAsztalok(d.data || []));
  }, [datum, idopont]);

  useEffect(() => {
    fetch("https://smarttables.hu/api/index.php/asztalok")
      .then(r => r.json()).then(d => setAsztalok(d.data || []));
  }, []);

  const szurtAsztalok = asztalok.filter(a =>
    !letszam || a.ferohely >= parseInt(letszam)
  );

  const handleFoglalas = async () => {
    if (isAdmin) {
      setError("Admin fiókkal nem lehet asztalt foglalni!");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) { setError("Be kell jelentkezni!"); return; }
    if (!selectedAsztal || !datum || !idopont || !letszam) {
      setError("Minden mezőt ki kell tölteni!"); return;
    }
    try {
      const res = await fetch("https://smarttables.hu/api/index.php/foglalas", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ datum, idopont, letszam, asztal_id: selectedAsztal, megjegyzes })
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); setSuccess(""); }
      else {
        setSuccess("✅ Sikeres foglalás!");
        setSelectedAsztal(null);
        setLetszam("");
        setMegjegyzes("");
        setError("");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch { setError("Hálózati hiba"); }
  };

  // Admin blokkoló üzenet
  if (isAdmin) {
    return (
      <div className="foglalas-page">
        <div className="foglalas-card" style={{ textAlign: "center", padding: "60px 30px" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🚫</div>
          <h2 style={{ color: "#facc15", marginBottom: 12 }}>Admin fiók</h2>
          <p style={{ color: "#aaa", fontSize: 16 }}>
            Admin fiókkal nem lehet asztalt foglalni.<br />
            Használd a vendég fiókot a foglaláshoz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="foglalas-page">
      <div className="foglalas-card">
        <h1>Asztalfoglalás</h1>

        <div className="form-row">
          <div className="input-group">
            <label>Dátum</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              onChange={e => setDatum(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Időpont</label>
            <input type="time" onChange={e => setIdopont(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Létszám</label>
            <input type="number" min="1" max="12" placeholder="pl. 4 fő"
              value={letszam} onChange={e => setLetszam(e.target.value)} />
          </div>
        </div>

        {/* MEGJEGYZÉS */}
        <div className="form-row">
          <div className="input-group" style={{ flex: 1 }}>
            <label>Megjegyzés (opcionális)</label>
            <input
              type="text"
              placeholder="pl. születésnap, allergia, különleges kérés..."
              value={megjegyzes}
              onChange={e => setMegjegyzes(e.target.value)}
              maxLength={200}
            />
          </div>
        </div>

        {/* JELMAGYARÁZAT */}
        <div className="jelmagyarazat">
          <span className="jelm-item"><span className="jelm-dot szabad" /> Szabad</span>
          <span className="jelm-item"><span className="jelm-dot foglalt" /> Foglalt</span>
          <span className="jelm-item"><span className="jelm-dot kivalasztva" /> Kiválasztva</span>
          <span className="jelm-item"><span className="jelm-kerek" /> Kerek</span>
          <span className="jelm-item"><span className="jelm-teglalap" /> Téglalap</span>
        </div>

        <h3>Válassz asztalt</h3>

        {/* TEREM WRAPPER */}
        <div className="terem-wrapper">
          <div className="etterem-terem">

            <div className="terem-fal terem-fal-ablak">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="ablak-elem" />)}
            </div>

            <div className="terem-bar">
              <span className="bar-label">Bár</span>
            </div>

            <span className="terem-noveny" style={{ bottom: 20, left: 50 }}>🌿</span>
            <span className="terem-noveny" style={{ bottom: 20, right: 20 }}>🌱</span>
            <span className="terem-noveny" style={{ top: 35, right: 16 }}>🪴</span>

            <div className="terem-bejarat">🚪 Bejárat</div>

            {szurtAsztalok.map(a => {
              const isFoglalt = foglaltAsztalok.includes(a.asztal_id);
              const isKivalasztva = selectedAsztal === a.asztal_id;
              const forma = ASZTAL_FORMA[a.asztal_szam] || "kerek";
              const allapot = isFoglalt ? "foglalt" : isKivalasztva ? "kivalasztva" : "szabad";

              return (
                <div
                  key={a.asztal_id}
                  className={`asztal-container asztal-${a.asztal_szam} ${forma} ${allapot} ferohely-${a.ferohely}`}
                  onClick={() => !isFoglalt && setSelectedAsztal(a.asztal_id)}
                  title={`${a.asztal_szam}. asztal – max. ${a.ferohely} fő`}
                >
                  <div className={`asztal-shape asztal-shape-${forma}`}>
                    <span className="asztal-num">{a.asztal_szam}</span>
                    <span className="asztal-ferohely">{a.ferohely} fő</span>
                  </div>
                  <Szekek forma={forma} ferohely={a.ferohely} />
                </div>
              );
            })}
          </div>
        </div>

        <button className="foglalas-btn"
          onClick={handleFoglalas}
          disabled={!datum || !idopont || !letszam || !selectedAsztal}>
          Foglalás elküldése
        </button>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
      </div>
    </div>
  );
}