import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("admin");

  const handleLogout = () => {
    localStorage.removeItem("vendeg");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* LOGO + TITLE */}
      <Link to="/" className="navbar-left">
        <img src="/logo.png" alt="SmartTable logo" className="navbar-logo" />
        <span className="navbar-title">SmartTable</span>
      </Link>

      {/* MENU */}
      <div className="navbar-right">


        <Link to="/rolunk">Rólunk</Link>
        <Link to="/kapcsolat">Kapcsolat</Link>
        <Link to="/etlap">Étlap</Link>
        {!token && !admin && (
          <>
            <Link to="/login">Bejelentkezés</Link>
            <Link to="/register">Regisztráció</Link>
            <Link to="/admin-login" style={{ color: "#facc15", fontWeight: "bold" }}>
              Admin
            </Link>
          </>
        )}

        {token && !admin && (
          <>
            <Link to="/profil">Profil</Link>
            <button onClick={handleLogout} style={{ background: "transparent", color: "white", border: "none", cursor: "pointer" }}>
              Kijelentkezés
            </button>
          </>
        )}

        {admin && (
          <>
            <Link to="/admin" style={{ color: "#facc15", fontWeight: "bold" }}>
              Admin panel
            </Link>
            <button onClick={handleLogout} style={{ background: "transparent", color: "white", border: "none", cursor: "pointer" }}>
              Kijelentkezés
            </button>
          </>
        )}

        

      </div>
    </nav>
  );
}// admin link
// kijelentkezés
// profil link
