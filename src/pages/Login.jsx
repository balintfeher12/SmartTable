import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8888/Backendd/index.php/vendeg/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, jelszo })
      });

      const data = await res.json();

      if (!data.success) {
        setError("Hibás adatok");
        return;
      }

      localStorage.setItem("token", data.token);

      navigate("/profil"); // 🔥 EZ HIÁNYZOTT

    } catch {
      setError("Hálózati hiba");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h1>Bejelentkezés</h1>

        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Jelszó" onChange={e => setJelszo(e.target.value)} />

        <button onClick={handleLogin}>Belépés</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}// hibakezelés
