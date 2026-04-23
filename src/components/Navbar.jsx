import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("admin");
  const [menuNyitva, setMenuNyitva] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("vendeg");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
    setMenuNyitva(false);
  };

  return (
    <nav className="navbar">

      <Link to="/" className="navbar-left" onClick={() => setMenuNyitva(false)}>
        <img src="/logo.png" alt="SmartTable logo" className="navbar-logo" />
        <span className="navbar-title">SmartTable</span>
      </Link>

      <button
        className={`hamburger ${menuNyitva ? "nyitva" : ""}`}
        onClick={() => setMenuNyitva(!menuNyitva)}
        aria-label="Menü"
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`navbar-right ${menuNyitva ? "nyitva" : ""}`}>
        <Link to="/rolunk" onClick={() => setMenuNyitva(false)}>Rólunk</Link>
        <Link to="/foglalas" onClick={() => setMenuNyitva(false)}>Foglalás</Link>
        <Link to="/kapcsolat" onClick={() => setMenuNyitva(false)}>Kapcsolat</Link>
        <Link to="/etlap" onClick={() => setMenuNyitva(false)}>Étlap</Link>

        {!token && !admin && (
          <>
            <Link to="/login" onClick={() => setMenuNyitva(false)}>Bejelentkezés</Link>
            <Link to="/register" onClick={() => setMenuNyitva(false)}>Regisztráció</Link>
            <Link to="/admin-login" onClick={() => setMenuNyitva(false)}
              style={{ color: "#facc15", fontWeight: "bold" }}>
              Admin
            </Link>
          </>
        )}

        {token && !admin && (
          <>
            <Link to="/profil" onClick={() => setMenuNyitva(false)}>Profil</Link>
            <button onClick={handleLogout}
              style={{ background: "transparent", color: "white", border: "none", cursor: "pointer" }}>
              Kijelentkezés
            </button>
          </>
        )}

        {admin && (
          <>
            <Link to="/admin" onClick={() => setMenuNyitva(false)}
              style={{ color: "#facc15", fontWeight: "bold" }}>
              Admin panel
            </Link>
            <button onClick={handleLogout}
              style={{ background: "transparent", color: "white", border: "none", cursor: "pointer" }}>
              Kijelentkezés
            </button>
          </>
        )}
      </div>
    </nav>
  );
}