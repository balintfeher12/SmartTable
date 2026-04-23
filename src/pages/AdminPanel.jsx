import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

const API = "http://localhost:8888/Backendd/index.php";

export default function AdminPanel() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  const token = localStorage.getItem("token");

  const [foglalasok, setFoglalasok] = useState([]);
  const [vendegek, setVendegek] = useState([]);
  const [asztalok, setAsztalok] = useState([]);
  const [aktifTab, setAktifTab] = useState("foglalasok");

  const [szuroDatum, setSzuroDatum] = useState("");
  const [szuroNev, setSzuroNev] = useState("");

  const [ujFerohely, setUjFerohely] = useState("");
  const [asztalMsg, setAsztalMsg] = useState("");

  const dragRef = useRef(null);

  useEffect(() => {
    if (!admin) { navigate("/admin-login"); return; }
    fetchFoglalasok();
    fetchVendegek();
    fetchAsztalok();
  }, []);

  const fetchFoglalasok = () => {
    fetch(`${API}/admin/foglalasok`, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(d => setFoglalasok(d.data || []));
  };

  const fetchVendegek = () => {
    fetch(`${API}/admin/vendegek`, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(d => setVendegek(d.data || []));
  };

  const fetchAsztalok = () => {
    fetch(`${API}/asztalok`, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(d => setAsztalok(d.data || []));
  };

  const handleTiltas = async (id, tiltott) => {
    await fetch(`${API}/admin/vendeg/${id}/tiltas`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ tiltott: tiltott ? 0 : 1 })
    });
    fetchVendegek();
  };

  const handleUjAsztal = async () => {
    if (!ujFerohely) return;
    const res = await fetch(`${API}/admin/asztal`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ ferohely: ujFerohely })
    });
    const d = await res.json();
    if (d.success) { setAsztalMsg("✅ Asztal hozzáadva!"); setUjFerohely(""); fetchAsztalok(); setTimeout(() => setAsztalMsg(""), 3000); }
  };

  const handleAsztalTorles = async (id) => {
    if (!window.confirm("Biztos törlöd ezt az asztalt?")) return;
    await fetch(`${API}/admin/asztal/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });
    fetchAsztalok();
  };

  const handleDragStart = (e, asztal) => {
    dragRef.current = { asztal, startX: e.clientX, startY: e.clientY };
  };

  const handleDrop = async (e) => {
    if (!dragRef.current) return;
    const terem = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - terem.left - 40;
    const y = e.clientY - terem.top - 40;
    const { asztal } = dragRef.current;

    setAsztalok(prev => prev.map(a =>
      a.asztal_id === asztal.asztal_id ? { ...a, x_pozicio: x, y_pozicio: y } : a
    ));

    await fetch(`${API}/admin/asztal/${asztal.asztal_id}/pozicio`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ x_pozicio: x, y_pozicio: y })
    });

    dragRef.current = null;
  };

  if (!admin) return null;

  const mai = new Date().toISOString().split("T")[0];
  const maiFoglalasok = foglalasok.filter(f => f.datum === mai).length;
  const tiltottVendegek = vendegek.filter(v => v.tiltott == 1).length;

  const szurtFoglalasok = foglalasok.filter(f => {
    const datumOk = !szuroDatum || f.datum === szuroDatum;
    const nevOk = !szuroNev || f.nev?.toLowerCase().includes(szuroNev.toLowerCase());
    return datumOk && nevOk;
  });

  return (
    <div className="admin-page">

      <div style={{ marginBottom: 30 }}>
        <h1 style={{ color: "#facc15", margin: 0, fontSize: 28 }}>🛠 Admin panel</h1>
        <p style={{ color: "#aaa", margin: "6px 0 0" }}>Bejelentkezve: {admin.email}</p>
      </div>

      <div style={{ display: "flex", gap: 20, marginBottom: 30, flexWrap: "wrap" }}>
        {[
          { num: foglalasok.length, label: "Összes foglalás" },
          { num: maiFoglalasok, label: "Mai aktív" },
          { num: vendegek.length, label: "Regisztrált vendég" },
          { num: tiltottVendegek, label: "Tiltott vendég" },
        ].map((s, i) => (
          <div key={i} style={statCard}>
            <div style={statNum}>{s.num}</div>
            <div style={statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { key: "foglalasok", label: `📅 Foglalások (${foglalasok.length})` },
          { key: "vendegek",   label: `👤 Vendégek (${vendegek.length})` },
          { key: "asztalok",   label: `🪑 Asztalok (${asztalok.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setAktifTab(t.key)}
            style={aktifTab === t.key ? tabAktiv : tabPassziv}>
            {t.label}
          </button>
        ))}
      </div>

      {aktifTab === "foglalasok" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <input type="date" value={szuroDatum} onChange={e => setSzuroDatum(e.target.value)}
              style={inputStyle} placeholder="Szűrés dátumra" />
            <input type="text" value={szuroNev} onChange={e => setSzuroNev(e.target.value)}
              style={inputStyle} placeholder="Szűrés névre..." />
            {(szuroDatum || szuroNev) && (
              <button onClick={() => { setSzuroDatum(""); setSzuroNev(""); }}
                style={{ ...tabPassziv, color: "#facc15" }}>✕ Törlés</button>
            )}
          </div>

          {szurtFoglalasok.length === 0 && <p style={{ color: "#aaa" }}>Nincs foglalás.</p>}

          <table style={tableStyle}>
            <thead>
              <tr>
                {["#", "Vendég", "Email", "Dátum", "Időpont", "Létszám", "Asztal"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {szurtFoglalasok.map((f, i) => (
                <tr key={f.foglalas_id} style={{ background: i % 2 === 0 ? "#111" : "#161616" }}>
                  <td style={tdStyle}>{f.foglalas_id}</td>
                  <td style={tdStyle}>{f.nev}</td>
                  <td style={tdStyle}>{f.email}</td>
                  <td style={tdStyle}>{f.datum}</td>
                  <td style={tdStyle}>{f.idopont}</td>
                  <td style={tdStyle}>{f.letszam} fő</td>
                  <td style={tdStyle}>{f.asztal_szam}. asztal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === "vendegek" && (
        <div>
          {vendegek.length === 0 && <p style={{ color: "#aaa" }}>Nincs vendég.</p>}
          <table style={tableStyle}>
            <thead>
              <tr>
                {["#", "Név", "Email", "Telefon", "Státusz", "Művelet"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendegek.map((v, i) => (
                <tr key={v.vendeg_id} style={{ background: i % 2 === 0 ? "#111" : "#161616" }}>
                  <td style={tdStyle}>{v.vendeg_id}</td>
                  <td style={tdStyle}>{v.nev}</td>
                  <td style={tdStyle}>{v.email}</td>
                  <td style={tdStyle}>{v.telefon || "–"}</td>
                  <td style={tdStyle}>
                    <span style={{
                      background: v.tiltott == 1 ? "#7f1d1d" : "#14532d",
                      color: v.tiltott == 1 ? "#fca5a5" : "#86efac",
                      padding: "3px 10px", borderRadius: 20, fontSize: 12
                    }}>
                      {v.tiltott == 1 ? "⛔ Tiltott" : "✅ Aktív"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleTiltas(v.vendeg_id, v.tiltott)}
                      style={{
                        background: v.tiltott == 1 ? "#14532d" : "#7f1d1d",
                        color: "white", border: "none", borderRadius: 6,
                        padding: "6px 12px", cursor: "pointer", fontSize: 12
                      }}>
                      {v.tiltott == 1 ? "✅ Feloldás" : "⛔ Tiltás"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === "asztalok" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
            <input type="number" min="1" max="12" placeholder="Férőhely"
              value={ujFerohely} onChange={e => setUjFerohely(e.target.value)}
              style={{ ...inputStyle, width: 120 }} />
            <button onClick={handleUjAsztal} style={tabAktiv}>+ Asztal hozzáadása</button>
            {asztalMsg && <span style={{ color: "#86efac", fontSize: 14 }}>{asztalMsg}</span>}
          </div>

          <p style={{ color: "#aaa", fontSize: 13, marginBottom: 12 }}>
            💡 Húzd az asztalokat a kívánt pozícióba!
          </p>

          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              position: "relative", width: "100%", height: 500,
              background: "#0a1628", border: "2px dashed #1a3a6e",
              borderRadius: 12, overflow: "hidden"
            }}
          >
            {asztalok.map(a => (
              <div
                key={a.asztal_id}
                draggable
                onDragStart={e => handleDragStart(e, a)}
                style={{
                  position: "absolute",
                  left: a.x_pozicio ? parseInt(a.x_pozicio) + "px" : "50px",
                  top: a.y_pozicio ? parseInt(a.y_pozicio) + "px" : "50px",
                  background: "#0b1c4d", border: "2px solid #facc15",
                  borderRadius: 8, padding: "8px 12px",
                  color: "white", cursor: "grab", userSelect: "none",
                  fontSize: 13, minWidth: 70, textAlign: "center"
                }}
              >
                <div style={{ color: "#facc15", fontWeight: "bold" }}>{a.asztal_szam}. asztal</div>
                <div style={{ color: "#aaa", fontSize: 11 }}>{a.ferohely} fő</div>
                <button
                  onClick={() => handleAsztalTorles(a.asztal_id)}
                  style={{
                    marginTop: 6, background: "#7f1d1d", color: "white",
                    border: "none", borderRadius: 4, padding: "2px 8px",
                    cursor: "pointer", fontSize: 11
                  }}
                >🗑</button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

const statCard = {
  background: "#111", border: "1px solid #222",
  borderRadius: 12, padding: "20px 30px",
  minWidth: 150, textAlign: "center"
};
const statNum = { fontSize: 36, fontWeight: "bold", color: "#facc15" };
const statLabel = { color: "#aaa", fontSize: 13, marginTop: 4 };
const tabAktiv = {
  background: "#facc15", color: "#0b1c4d",
  border: "none", borderRadius: 8,
  padding: "10px 20px", fontWeight: "bold",
  cursor: "pointer", fontSize: 14
};
const tabPassziv = {
  background: "#1a1a1a", color: "#aaa",
  border: "1px solid #333", borderRadius: 8,
  padding: "10px 20px", cursor: "pointer", fontSize: 14
};
const tableStyle = {
  width: "100%", borderCollapse: "collapse",
  borderRadius: 12, overflow: "hidden",
  border: "1px solid #222"
};
const thStyle = {
  background: "#0b1c4d", color: "#facc15",
  padding: "12px 16px", textAlign: "left",
  fontSize: 13, fontWeight: "bold"
};
const tdStyle = {
  padding: "12px 16px", color: "#ddd",
  fontSize: 14, borderBottom: "1px solid #222"
};
const inputStyle = {
  background: "#111", border: "1px solid #333",
  borderRadius: 8, padding: "8px 12px",
  color: "white", fontSize: 14
};