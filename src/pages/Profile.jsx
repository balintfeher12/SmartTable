import { useEffect, useState } from "react";
import "../styles/profile.css";

const API = "http://localhost:8888/Backendd/index.php";

export default function Profil() {
  const [foglalasok, setFoglalasok] = useState([]);
  const [nev, setNev] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");

  const [regiJelszo, setRegiJelszo] = useState("");
  const [ujJelszo, setUjJelszo] = useState("");
  const [jelszoMsg, setJelszoMsg] = useState("");
  const [jelszoError, setJelszoError] = useState("");
  const [showRegiJelszo, setShowRegiJelszo] = useState(false);
  const [showUjJelszo, setShowUjJelszo] = useState(false);

  const [editFoglalas, setEditFoglalas] = useState(null);
  const [editDatum, setEditDatum] = useState("");
  const [editIdopont, setEditIdopont] = useState("");
  const [editLetszam, setEditLetszam] = useState("");
  const [editAsztalId, setEditAsztalId] = useState("");
  const [szabadAsztalok, setSzabadAsztalok] = useState([]);
  const [editMsg, setEditMsg] = useState("");
  const [editError, setEditError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API}/vendeg/profil`, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          setNev(d.data.nev);
          setEmail(d.data.email);
          setTelefon(d.data.telefon || "");
        }
      });
  }, []);

  useEffect(() => {
    fetch(`${API}/foglalas/sajat`, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json())
      .then(d => setFoglalasok(d.data || []));
  }, []);

  useEffect(() => {
    if (!editDatum || !editIdopont) return;
    fetch(`${API}/foglalas/foglalt?datum=${editDatum}&idopont=${editIdopont}`)
      .then(r => r.json())
      .then(d => {
        const foglaltIds = d.data || [];
        fetch(`${API}/asztalok`)
          .then(r => r.json())
          .then(a => {
            const szabad = (a.data || []).filter(
              asz => !foglaltIds.includes(asz.asztal_id) || asz.asztal_id === editFoglalas?.asztal_id
            );
            setSzabadAsztalok(szabad);
          });
      });
  }, [editDatum, editIdopont]);

  const handleSave = async () => {
    setSaveMsg(""); setSaveError("");
    const res = await fetch(`${API}/vendeg/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ nev, email, telefon })
    });
    const d = await res.json();
    if (d.success) { setSaveMsg("✅ Adatok sikeresen mentve!"); setTimeout(() => setSaveMsg(""), 3000); }
    else { setSaveError("❌ Hiba történt."); setTimeout(() => setSaveError(""), 3000); }
  };

  const handleJelszo = async () => {
    setJelszoMsg(""); setJelszoError("");
    if (!regiJelszo || !ujJelszo) { setJelszoError("Töltsd ki mindkét mezőt!"); return; }
    if (ujJelszo.length < 6) { setJelszoError("Az új jelszó legalább 6 karakter legyen!"); return; }
    const res = await fetch(`${API}/vendeg/jelszo`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ regi_jelszo: regiJelszo, uj_jelszo: ujJelszo })
    });
    const d = await res.json();
    if (d.success) {
      setJelszoMsg("✅ Jelszó sikeresen megváltoztatva!");
      setRegiJelszo(""); setUjJelszo("");
      setTimeout(() => setJelszoMsg(""), 3000);
    } else {
      setJelszoError("❌ " + (d.message || "Hiba történt"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztos törlöd ezt a foglalást?")) return;
    await fetch(`${API}/foglalas/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });
    setFoglalasok(foglalasok.filter(f => f.foglalas_id !== id));
  };

  const openEdit = (f) => {
    setEditFoglalas(f);
    setEditDatum(f.datum);
    setEditIdopont(f.idopont?.slice(0,5));
    setEditLetszam(f.letszam);
    setEditAsztalId(f.asztal_id);
    setEditMsg(""); setEditError("");
    setSzabadAsztalok([]);
  };

  const handleEdit = async () => {
    setEditMsg(""); setEditError("");
    try {
      await fetch(`${API}/foglalas/${editFoglalas.foglalas_id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
      });
      const res = await fetch(`${API}/foglalas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({
          datum: editDatum,
          idopont: editIdopont,
          letszam: editLetszam,
          asztal_id: editAsztalId
        })
      });
      const d = await res.json();
      if (d.success) {
        setEditMsg("✅ Foglalás módosítva!");
        const r2 = await fetch(`${API}/foglalas/sajat`, { headers: { Authorization: "Bearer " + token } });
        const d2 = await r2.json();
        setFoglalasok(d2.data || []);
        setTimeout(() => { setEditFoglalas(null); setEditMsg(""); }, 1500);
      } else {
        setEditError("❌ " + (d.message || "Hiba történt"));
      }
    } catch {
      setEditError("❌ Hálózati hiba");
    }
  };

  return (
    <div className="profil-page">
      <div className="profil-card">

        <h2>👤 Profil</h2>

        <div className="form-row">
          <input value={nev} onChange={e => setNev(e.target.value)} placeholder="Név" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input placeholder="Telefonszám" value={telefon} onChange={e => setTelefon(e.target.value)} />
        </div>

        <button onClick={handleSave}>💾 Mentés</button>
        {saveMsg   && <p className="success-msg">{saveMsg}</p>}
        {saveError && <p className="error-msg">{saveError}</p>}

        <h2 style={{ marginTop: 30 }}>🔒 Jelszó módosítása</h2>
        <div className="form-row">
          <div style={{ position: "relative" }}>
            <input
              type={showRegiJelszo ? "text" : "password"}
              placeholder="Jelenlegi jelszó"
              value={regiJelszo}
              onChange={e => setRegiJelszo(e.target.value)}
            />
            <span onClick={() => setShowRegiJelszo(!showRegiJelszo)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
              {showRegiJelszo ? "🙈" : "👁"}
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showUjJelszo ? "text" : "password"}
              placeholder="Új jelszó (min. 6 karakter)"
              value={ujJelszo}
              onChange={e => setUjJelszo(e.target.value)}
            />
            <span onClick={() => setShowUjJelszo(!showUjJelszo)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
              {showUjJelszo ? "🙈" : "👁"}
            </span>
          </div>
        </div>
        <button onClick={handleJelszo}>🔒 Jelszó módosítása</button>
        {jelszoMsg   && <p className="success-msg">{jelszoMsg}</p>}
        {jelszoError && <p className="error-msg">{jelszoError}</p>}

        <h2 style={{ marginTop: 30 }}>📅 Foglalások</h2>

        {foglalasok.length === 0 && <p style={{ color: "#aaa" }}>Nincs aktív foglalása.</p>}

        {foglalasok.map(f => (
          <div key={f.foglalas_id} className="foglalas-card-item">
            <div className="foglalas-info">
              📅 {f.datum}<br />
              ⏰ {f.idopont}<br />
              🍽 Asztal: {f.asztal_szam}<br />
              👥 {f.letszam} fő
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="edit-btn" onClick={() => openEdit(f)}>✏️ Módosítás</button>
              <button className="delete-btn" onClick={() => handleDelete(f.foglalas_id)}>🗑 Törlés</button>
            </div>
          </div>
        ))}

      </div>

      {editFoglalas && (
        <div className="modal-backdrop" onClick={() => setEditFoglalas(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>✏️ Foglalás módosítása</h3>

            <div className="modal-form">
              <label>Dátum</label>
              <input type="date" value={editDatum} onChange={e => setEditDatum(e.target.value)} />

              <label>Időpont</label>
              <input type="time" value={editIdopont} onChange={e => setEditIdopont(e.target.value)} />

              <label>Létszám</label>
              <input type="number" min="1" max="12" value={editLetszam}
                onChange={e => setEditLetszam(e.target.value)} />

              <label>Asztal</label>
              <select value={editAsztalId} onChange={e => setEditAsztalId(e.target.value)}>
                {szabadAsztalok.length === 0
                  ? <option>Adja meg a dátumot és időpontot</option>
                  : szabadAsztalok.map(a => (
                      <option key={a.asztal_id} value={a.asztal_id}>
                        {a.asztal_szam}. asztal – max. {a.ferohely} fő
                      </option>
                    ))
                }
              </select>
            </div>

            {editMsg   && <p className="success-msg">{editMsg}</p>}
            {editError && <p className="error-msg">{editError}</p>}

            <div className="modal-btns">
              <button className="modal-cancel" onClick={() => setEditFoglalas(null)}>Mégse</button>
              <button className="modal-save" onClick={handleEdit}
                disabled={!editDatum || !editIdopont || !editLetszam || !editAsztalId}>
                Mentés
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}