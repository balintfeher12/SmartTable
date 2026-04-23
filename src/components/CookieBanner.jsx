import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieAccepted");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookieAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#0b1c4d", color: "white",
      padding: "16px 24px", display: "flex",
      alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 12, zIndex: 9999
    }}>
      <p style={{ margin: 0, fontSize: 14 }}>
        🍪 Ez az oldal sütiket használ.{" "}
        <Link to="/adatvedelem" style={{ color: "#facc15" }}>Adatvédelmi nyilatkozat</Link>
      </p>
      <button onClick={accept} style={{
        background: "#facc15", color: "#0b1c4d",
        border: "none", padding: "8px 20px",
        borderRadius: 50, fontWeight: "bold", cursor: "pointer"
      }}>Elfogadom</button>
    </div>
  );
}