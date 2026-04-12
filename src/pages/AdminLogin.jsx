import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [jelszo, setJelszo] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:8888/Backendd/index.php/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, jelszo })
            });

            const data = await res.json();

            if (data.success) {

                // 🔐 ADMIN ADAT
                localStorage.setItem("admin", JSON.stringify(data.data.admin));

                // 🔐 TOKEN
                localStorage.setItem("token", data.data.token);

                navigate("/admin");

            } else {
                setMessage(data.error);
            }

        } catch {
            setMessage("Szerver hiba");
        }
    };


    return (
        <div className="auth-bg">
            <div className="auth-card">
                <h1>Admin belépés</h1>

                <input
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Jelszó"
                    value={jelszo}
                    onChange={e => setJelszo(e.target.value)}
                />

                <button onClick={handleLogin}>Belépés</button>

                <p>{message}</p>
            </div>
        </div>
    );
}
