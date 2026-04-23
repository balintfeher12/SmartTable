import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const [nev, setNev] = useState("");
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    if (nev.trim().length < 2) {
      setError("A név legalább 2 karakter legyen.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Érvénytelen email cím.");
      return false;
    }

    if (jelszo.length < 6) {
      setError("A jelszó legalább 6 karakter legyen.");
      return false;
    }

    if (!gdpr) {
      setError("El kell fogadni az adatvédelmi nyilatkozatot.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:8888/Backendd/index.php/vendeg/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nev, email, jelszo })
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Hiba történt");
      } else {
        setSuccess("✅ Sikeres regisztráció!");
        setNev("");
        setEmail("");
        setJelszo("");
        setGdpr(false);
      }

    } catch {
      setError("Hálózati hiba");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h1>Regisztráció</h1>

        <input
          type="text"
          placeholder="Név (min. 2 karakter)"
          value={nev}
          onChange={e => setNev(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Jelszó (min. 6 karakter)"
          value={jelszo}
          onChange={e => setJelszo(e.target.value)}
        />

        <label style={{ fontSize: 13, color: "#aaa", display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
          <input
            type="checkbox"
            checked={gdpr}
            onChange={e => setGdpr(e.target.checked)}
          />
          Elfogadom az{" "}
          <Link to="/adatvedelem" style={{ color: "#facc15" }}>
            adatvédelmi nyilatkozatot
          </Link>
        </label>

        <button onClick={handleRegister}>
          Regisztráció
        </button>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
      </div>
    </div>
  );
}