import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

export default function AdminPanel() {
    const navigate = useNavigate();
    const admin = JSON.parse(localStorage.getItem("admin") || "null");
    const token = localStorage.getItem("token");

    const [foglalasok, setFoglalasok] = useState([]);
    const [vendegek, setVendegek] = useState([]);
    const [aktifTab, setAktifTab] = useState("foglalasok");

    useEffect(() => {
        if (!admin) {
            navigate("/admin-login");
            return;
        }

        // FOGLALÁSOK
        fetch("http://localhost:8888/Backendd/index.php/admin/foglalasok", {
            headers: { "Authorization": "Bearer " + token }
        })
            .then(res => res.json())
            .then(data => setFoglalasok(data.data || []));

        // VENDÉGEK
        fetch("http://localhost:8888/Backendd/index.php/admin/vendegek", {
            headers: { "Authorization": "Bearer " + token }
        })
            .then(res => res.json())
            .then(data => setVendegek(data.data || []));

    }, []);

    if (!admin) return null;

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
                    <div style={statNum}>{vendegek.length}</div>
                    <div style={statLabel}>Regisztrált vendég</div>
                </div>
            </div>

            {/* TABOK */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                <button
                    onClick={() => setAktifTab("foglalasok")}
                    style={aktifTab === "foglalasok" ? tabAktiv : tabPassziv}
                >
                    📅 Foglalások ({foglalasok.length})
                </button>
                <button
                    onClick={() => setAktifTab("vendegek")}
                    style={aktifTab === "vendegek" ? tabAktiv : tabPassziv}
                >
                    👤 Vendégek ({vendegek.length})
                </button>
            </div>

            {/* FOGLALÁSOK TAB */}
            {aktifTab === "foglalasok" && (
                <div>
                    {foglalasok.length === 0 && <p style={{ color: "#aaa" }}>Nincs foglalás.</p>}

                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                {["#", "Vendég", "Email", "Dátum", "Időpont", "Létszám", "Asztal"].map(h => (
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* VENDÉGEK TAB */}
            {aktifTab === "vendegek" && (
                <div>
                    {vendegek.length === 0 && <p style={{ color: "#aaa" }}>Nincs vendég.</p>}

                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                {["#", "Név", "Email", "Telefon"].map(h => (
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}

// STÍLUSOK
const statCard = {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 12,
    padding: "20px 30px",
    minWidth: 150,
    textAlign: "center"
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
};// vendég tab
// statisztika
// redirect
// admin email
