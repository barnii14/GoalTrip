import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { setAuth } from "../utils/auth";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Kérlek add meg az emailt és a jelszót.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Hibás bejelentkezés.");
        return;
      }

      setAuth(data.data.token, data.data.user);
      navigate("/profil");
    } catch (err) {
      console.error(err);
      setError("Hiba történt a bejelentkezés során.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gt-auth-page">
      <section className="gt-panel" style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 16 }}>Bejelentkezés</h1>
        <p className="gt-muted" style={{ marginBottom: 24 }}>
          Add meg az email címed és jelszavad a bejelentkezéshez.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="gt-input"
              placeholder="teszt@pelda.hu"
            />
          </label>

          <label>
            Jelszó
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="gt-input"
              placeholder="********"
            />
          </label>

          {error && <div className="gt-error">{error}</div>}

          <button className="gt-btn" type="submit" disabled={loading}>
            {loading ? "Betöltés..." : "Bejelentkezés"}
          </button>
        </form>

        <p className="gt-muted" style={{ marginTop: 18 }}>
          Még nincs fiókod? <Link to="/regisztracio">Regisztrálj most</Link>.
        </p>
      </section>
    </div>
  );
}
