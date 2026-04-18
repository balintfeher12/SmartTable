import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

const API = "https://smarttables.hu/api/index.php";

export default function AdminPanel() {
    const navigate = useNavigate();
    const admin = JSON.parse(localStorage.getItem("admin") || "null");
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    const [foglalasok, setFoglalasok] = useState([]);
    const [vendegek, setVendegek] = useState([]);
    const [aktifTab, setAktifTab] = useState("foglalasok");

    // Szűrők
    const [szuroDatum, setSzuroDatum] = useState("");
    const [szuroNev, setSzuroNev] = useState("");

    // Asztal hozzáadás
    const [ujAsztalSzam, setUjAsztalSzam] = useState("");
    const [ujAsztalFero, setUjAsztalFero] = useState("");
    const [ujAsztalHely, setUjAsztalHely] = useState("belter");
    const [asztalMsg, setAsztalMsg] = useState("");

    const fetchFoglalasok = (datum = "", nev = "") => {
        let url = `${API}/admin/foglalasok`;
        const params = [];
        if (datum) params.push(`datum=${datum}`);
        if (nev)   params.push(`nev=${encodeURIComponent(nev)}`);
        if (params.length) url += "?" + params.join("&");

        fetch(url, { headers: { "Authorization": "Bearer " + token } })
            .then(res => res.json())
            .then(data => setFoglalasok(data.data || []));
    };

    const fetchVendegek = () => {
        fetch(`${API}/admin/vendegek`, {
            headers: { "Authorization": "Bearer " + token }
        })
            .then(res => res.json())
            .then(data => setVendegek(data.data || []));
    };

    useEffect(() => {
        if (!admin) { navigate("/admin-login"); return; }
        fetchFoglalasok();
        fetchVendegek();
    }, []);

    // Szűrés triggerelése
    useEffect(() => {
        fetchFoglalasok(szuroDatum, szuroNev);
    }, [szuroDatum, szuroNev]);

    if (!admin) return null;

    // Tiltás / feloldás
    const handleTiltas = async (vendeg_id, tiltott) => {
        const megerosit = window.confirm(
            tiltott ? "Feloldja a tiltást?" : "Letiltja ezt a vendéget?"
        );
        if (!megerosit) return;

        const res = await fetch(`${API}/admin/vendeg/${vendeg_id}/tiltas`, {
            method: "PATCH",
            headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();
        if (data.success) fetchVendegek();
        else alert("Hiba: " + data.message);
    };

    // Asztal hozzáadás
    const handleAsztalHozzaad = async () => {
        if (!ujAsztalSzam || !ujAsztalFero) {
            setAsztalMsg("Töltsd ki az összes mezőt!");
            return;
        }
        const res = await fetch(`${API}/admin/asztal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                asztal_szam: parseInt(ujAsztalSzam),
                ferohely: parseInt(ujAsztalFero),
                hely: ujAsztalHely
            })
        });
        const data = await res.json();
        if (data.success) {
            setAsztalMsg("✅ Asztal hozzáadva!");
            setUjAsztalSzam("");
            setUjAsztalFero("");
        } else {
            setAsztalMsg("❌ " + data.message);
        }
    };

    const maiAktivFoglalasok = foglalasok.filter(f => {
        const ma = new Date().toISOString().split("T")[0];
        return f.datum >= ma && f.statusz === "aktiv";
    }).length;

    return (
        <div className="admin-page">

            {/* FEJLÉC */}
            <div style={{ marginBottom: 30 }}>
                <h1 style={{ color: "#facc15", margin: 0, fontSize: 28 }}>🛠 Admin panel</h1>
                <p style={{ color: "#aaa", margin: "6px 0 0" }}>Bejelentkezve: {admin.email}</p>
            </div>

            {/* STATISZTIKA */}
            <div style={{ display: "flex", gap: 20, marginBottom: 30, flexWrap: "wrap" }}>
                <div style={statCard}>
                    <div style={statNum}>{foglalasok.length}</div>
                    <div style={statLabel}>Összes foglalás</div>
                </div>
                <div style={statCard}>
                    <div style={statNum}>{maiAktivFoglalasok}</div>
                    <div style={statLabel}>Mai aktív foglalás</div>
                </div>
                <div style={statCard}>
                    <div style={statNum}>{vendegek.length}</div>
                    <div style={statLabel}>Regisztrált vendég</div>
                </div>
                <div style={statCard}>
                    <div style={statNum}>{vendegek.filter(v => v.tiltott == 1).length}</div>
                    <div style={statLabel}>Tiltott vendég</div>
                </div>
            </div>

            {/* TABOK */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
                {[
                    { key: "foglalasok", label: `📅 Foglalások (${foglalasok.length})` },
                    { key: "vendegek",   label: `👤 Vendégek (${vendegek.length})` },
                    { key: "asztalok",   label: "🪑 Asztalok" },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setAktifTab(tab.key)}
                        style={aktifTab === tab.key ? tabAktiv : tabPassziv}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* FOGLALÁSOK TAB */}
            {aktifTab === "foglalasok" && (
                <div>
                    {/* SZŰRŐK */}
                    <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                        <input
                            type="date"
                            value={szuroDatum}
                            onChange={e => setSzuroDatum(e.target.value)}
                            style={inputStyle}
                            placeholder="Szűrés dátumra"
                        />
                        <input
                            type="text"
                            value={szuroNev}
                            onChange={e => setSzuroNev(e.target.value)}
                            style={inputStyle}
                            placeholder="Szűrés vendég neve szerint..."
                        />
                        {(szuroDatum || szuroNev) && (
                            <button
                                onClick={() => { setSzuroDatum(""); setSzuroNev(""); }}
                                style={{ ...tabPassziv, color: "#f87171" }}
                            >
                                ✕ Szűrő törlése
                            </button>
                        )}
                    </div>

                    {foglalasok.length === 0
                        ? <p style={{ color: "#aaa" }}>Nincs találat.</p>
                        : (
                            <div style={{ overflowX: "auto" }}>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr>
                                            {["#", "Vendég", "Email", "Dátum", "Időpont", "Létszám", "Asztal", "Megjegyzés", "Státusz"].map(h => (
                                                <th key={h} style={thStyle}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {foglalasok.map((f, i) => (
                                            <tr key={f.foglalas_id} style={{ background: i % 2 === 0 ? "#111" : "#161616" }}>
                                                <td style={tdStyle}>{f.foglalas_id}</td>
                                                <td style={tdStyle}>{f.nev}</td>
                                                <td style={tdStyle}>{f.email}</td>
                                                <td style={tdStyle}>{f.datum}</td>
                                                <td style={tdStyle}>{f.idopont}</td>
                                                <td style={tdStyle}>{f.letszam} fő</td>
                                                <td style={tdStyle}>{f.asztal_szam}. asztal</td>
                                                <td style={tdStyle}>{f.megjegyzes || "–"}</td>
                                                <td style={tdStyle}>
                                                    <span style={{
                                                        background: f.statusz === "aktiv" ? "#14532d" : "#333",
                                                        color: f.statusz === "aktiv" ? "#4ade80" : "#aaa",
                                                        padding: "3px 10px", borderRadius: 20, fontSize: 12
                                                    }}>
                                                        {f.statusz}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                </div>
            )}

            {/* VENDÉGEK TAB */}
            {aktifTab === "vendegek" && (
                <div>
                    {vendegek.length === 0
                        ? <p style={{ color: "#aaa" }}>Nincs vendég.</p>
                        : (
                            <div style={{ overflowX: "auto" }}>
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
                                                        color: v.tiltott == 1 ? "#f87171" : "#4ade80",
                                                        padding: "3px 10px", borderRadius: 20, fontSize: 12
                                                    }}>
                                                        {v.tiltott == 1 ? "Tiltott" : "Aktív"}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}>
                                                    <button
                                                        onClick={() => handleTiltas(v.vendeg_id, v.tiltott)}
                                                        style={{
                                                            background: v.tiltott == 1 ? "#14532d" : "#7f1d1d",
                                                            color: v.tiltott == 1 ? "#4ade80" : "#f87171",
                                                            border: "none", borderRadius: 6,
                                                            padding: "6px 14px", cursor: "pointer",
                                                            fontSize: 12, fontWeight: "bold"
                                                        }}
                                                    >
                                                        {v.tiltott == 1 ? "🔓 Feloldás" : "🚫 Tiltás"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                </div>
            )}

            {/* ASZTALOK TAB */}
            {aktifTab === "asztalok" && (
                <div>
                    <h3 style={{ color: "#facc15", marginBottom: 16 }}>Új asztal hozzáadása</h3>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                        <input
                            type="number"
                            placeholder="Asztal száma (pl. 16)"
                            value={ujAsztalSzam}
                            onChange={e => setUjAsztalSzam(e.target.value)}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Férőhely (pl. 4)"
                            value={ujAsztalFero}
                            onChange={e => setUjAsztalFero(e.target.value)}
                            style={inputStyle}
                        />
                        <select
                            value={ujAsztalHely}
                            onChange={e => setUjAsztalHely(e.target.value)}
                            style={{ ...inputStyle, cursor: "pointer" }}
                        >
                            <option value="belter">Belter</option>
                            <option value="kulter">Kültér</option>
                        </select>
                        <button onClick={handleAsztalHozzaad} style={tabAktiv}>
                            ➕ Hozzáadás
                        </button>
                    </div>
                    {asztalMsg && (
                        <p style={{ color: asztalMsg.startsWith("✅") ? "#4ade80" : "#f87171", marginBottom: 16 }}>
                            {asztalMsg}
                        </p>
                    )}
                    <p style={{ color: "#aaa", fontSize: 13 }}>
                        Az asztalok törlését a foglalás oldal alaprajzán is frissíteni kell.
                    </p>
                </div>
            )}

        </div>
    );
}

// STÍLUSOK
const statCard = {
    background: "#111", border: "1px solid #222",
    borderRadius: 12, padding: "20px 30px",
    minWidth: 150, textAlign: "center"
};
const statNum   = { fontSize: 36, fontWeight: "bold", color: "#facc15" };
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
    padding: "10px 14px", borderRadius: 8,
    border: "1px solid #333", background: "#111",
    color: "white", fontSize: 14, minWidth: 180
};