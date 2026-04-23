import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function RegisterPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("A név, email és jelszó megadása kötelező.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          address,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Hiba történt a regisztráció során.");
        return;
      }

      setSuccess("Sikeres regisztráció! Bejelentkezéshez kattints a linkre.");
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setAddress("");

      setTimeout(() => {
        navigate("/bejelentkezes");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Hiba történt a regisztráció során.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gt-auth-page">
      <section className="gt-panel" style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 16 }}>Regisztráció</h1>
        <p className="gt-muted" style={{ marginBottom: 24 }}>
          Hozz létre új fiókot a megrendelésekhez és profilodhoz.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <label>
            Teljes név
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="gt-input"
              placeholder="Teszt Elek"
            />
          </label>

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
            />
          </label>

          <label>
            Telefonszám
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="gt-input"
              placeholder="+36 30 123 4567"
            />
          </label>

          <label>
            Cím
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="gt-input"
              placeholder="Budapest"
            />
          </label>

          {error && <div className="gt-error">{error}</div>}
          {success && <div className="gt-success">{success}</div>}

          <button className="gt-btn" type="submit" disabled={loading}>
            {loading ? "Regisztrálás..." : "Regisztráció"}
          </button>
        </form>

        <p className="gt-muted" style={{ marginTop: 18 }}>
          Már van fiókod? <Link to="/bejelentkezes">Jelentkezz be</Link>.
        </p>
      </section>
    </div>
  );
}
