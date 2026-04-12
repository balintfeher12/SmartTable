import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* LOGO + MOTTÓ */}
        <div className="footer-col footer-brand">
          <div className="footer-logo">
            <img src="/logo.png" alt="SmartTable" className="footer-logo-img" />
            <span className="footer-logo-text">SmartTable</span>
          </div>
          <p className="footer-motto">
            Ahol minden étkezés<br />különleges pillanat.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#" aria-label="TripAdvisor">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* NAVIGÁCIÓ */}
        <div className="footer-col">
          <h4 className="footer-heading">Navigáció</h4>
          <ul className="footer-links">
            <li><Link to="/">Főoldal</Link></li>
            <li><Link to="/etlap">Étlap</Link></li>
            <li><Link to="/foglalas">Foglalás</Link></li>
            <li><Link to="/rolunk">Rólunk</Link></li>
            <li><Link to="/kapcsolat">Kapcsolat</Link></li>
          </ul>
        </div>

        {/* NYITVATARTÁS */}
        <div className="footer-col">
          <h4 className="footer-heading">Nyitvatartás</h4>
          <ul className="footer-hours">
            <li><span>Hétfő – Csütörtök</span><span>11:00 – 22:00</span></li>
            <li><span>Péntek – Szombat</span><span>11:00 – 23:30</span></li>
            <li><span>Vasárnap</span><span>12:00 – 21:00</span></li>
          </ul>
        </div>

        {/* KAPCSOLAT */}
        <div className="footer-col">
          <h4 className="footer-heading">Elérhetőség</h4>
          <ul className="footer-contact">
            <li>📍 7621 Pécs, Fő utca 1.</li>
            <li>📞 +36 30 123 4567</li>
            <li>📧 info@smarttable.hu</li>
          </ul>
        </div>

      </div>

      {/* ALSÓ SÁV */}
      <div className="footer-bottom">
        <p>© 2026 SmartTable. Minden jog fenntartva.</p>
        <p>Fejlesztette: Fehér Bálint, Balikó Benjámin, Ignácz Dávid</p>
      </div>
    </footer>
  );
}// nyitvatartás
// social ikonok
