import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Foglalas from "./pages/Foglalas";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Etlap from "./pages/Etlap";
import "./styles/base.css";
import "./styles/navbar.css";
import "./styles/auth.css";
import "./styles/home.css";
import "./styles/hero.css";
import "./styles/foglalas.css";
import "./styles/profile.css";
import "./styles/modal.css";
import "./styles/footer.css";

function Home() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <div className="hero">
        <div className="hero-overlay" />
        <div className="hero-box">
          <p className="hero-eyebrow">🍽 Prémium Étterem</p>
          <h1>ÜDVÖZÖLJÜK!</h1>
          <p>
            Foglaljon asztalt percek alatt — és élvezze séfünk
            gondosan összeállított, szezonális fogásait.
          </p>
          <div className="hero-btns">
            <Link to="/foglalas">
              <button className="hero-btn-primary">Asztalt foglalok</button>
            </Link>
            <Link to="/etlap">
              <button className="hero-btn-secondary">Étlapunk →</button>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== ELŐNYÖK SÁV ===== */}
      <div className="features-bar">
        <div className="feature-item">
          <span className="feature-ikon">⚡</span>
          <div>
            <strong>Azonnali foglalás</strong>
            <p>Online, telefonálás nélkül</p>
          </div>
        </div>
        <div className="feature-divider" />
        <div className="feature-item">
          <span className="feature-ikon">📅</span>
          <div>
            <strong>Valós idejű szabad helyek</strong>
            <p>Nincs dupla foglalás</p>
          </div>
        </div>
        <div className="feature-divider" />
        <div className="feature-item">
          <span className="feature-ikon">📧</span>
          <div>
            <strong>Email visszaigazolás</strong>
            <p>Azonnal a postaládájába</p>
          </div>
        </div>
        <div className="feature-divider" />
        <div className="feature-item">
          <span className="feature-ikon">🍷</span>
          <div>
            <strong>Prémium élmény</strong>
            <p>Friss, helyi alapanyagok</p>
          </div>
        </div>
      </div>

      {/* ===== AJÁNLÓ SZEKCIÓ ===== */}
      <div className="about-strip">
        <div className="about-strip-img" />
        <div className="about-strip-text">
          <p className="strip-eyebrow">Miért minket válasszon?</p>
          <h2>Több mint egy étterem</h2>
          <p>
            Séfünk minden fogást friss, gondosan válogatott, helyi
            alapanyagokból készít. Vendégeink számára különleges
            atmoszférát és személyre szabott kiszolgálást nyújtunk —
            minden alkalomra.
          </p>
          <Link to="/rolunk">
            <button className="strip-btn">Ismerjen meg minket →</button>
          </Link>
        </div>
      </div>

      {/* ===== ÉTLAP KIEMELT ===== */}
      <div className="menu-teaser">
        <div className="menu-teaser-inner">
          <p className="strip-eyebrow" style={{ textAlign: "center" }}>Kínálatunkból</p>
          <h2 style={{ textAlign: "center", color: "white", marginBottom: 40 }}>
            Séfünk ajánlata
          </h2>
          <div className="menu-cards">
            {[
              { nev: "Ribeye Steak", leiras: "Érlelt marhahús, vajas burgonyapürével", ar: "8 900 Ft", emoji: "🥩" },
              { nev: "Sült Lazac", leiras: "Citromos kapros mártással, spárgával", ar: "7 200 Ft", emoji: "🐟" },
              { nev: "Crème Brûlée", leiras: "Vaníliás karamell, erdei gyümölcsökkel", ar: "2 600 Ft", emoji: "🍮" },
            ].map((e, i) => (
              <div className="menu-card" key={i}>
                <div className="menu-card-emoji">{e.emoji}</div>
                <h3>{e.nev}</h3>
                <p>{e.leiras}</p>
                <span className="menu-card-ar">{e.ar}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link to="/etlap">
              <button className="strip-btn">Teljes étlap megtekintése →</button>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== CTA SÁV ===== */}
      <div className="cta-strip">
        <h2>Készen áll az asztalt foglalni?</h2>
        <p>Válasszon időpontot és asztalt percek alatt, online.</p>
        <Link to="/foglalas">
          <button className="hero-btn-primary">Foglalás most</button>
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/foglalas"    element={<Foglalas />} />
        <Route path="/profil"      element={<Profile />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin"       element={<AdminPanel />} />
        <Route path="/rolunk"      element={<About />} />
        <Route path="/kapcsolat"   element={<Contact />} />
        <Route path="/etlap"       element={<Etlap />} />
      </Routes>
      <Footer />
    </Router>
  );
}// routing frissítve
// footer beillesztve
