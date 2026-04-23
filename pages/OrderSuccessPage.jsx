import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function OrderSuccessPage() {
  return (
    <Layout>
      <div
        className="gt-panel"
        style={{
          maxWidth: "720px",
          margin: "40px auto",
          padding: "40px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            width: "84px",
            height: "84px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "rgba(57,255,136,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem"
          }}
        >
          ✅
        </div>

        <h1 className="gt-title" style={{ marginBottom: "12px" }}>
          Sikeres rendelés
        </h1>

        <p className="gt-muted" style={{ fontSize: "1.05rem", marginBottom: "28px" }}>
          Köszönjük a rendelést! A megrendelés frontend demóként sikeresen rögzítésre került.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            flexWrap: "wrap"
          }}
        >
          <Link
            to="/"
            className="gt-btn gt-btn-primary"
            style={{ textDecoration: "none" }}
          >
            Vissza a főoldalra
          </Link>

          <Link
            to="/mezek"
            className="gt-btn"
            style={{
              textDecoration: "none",
              background: "#222",
              color: "white",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            Tovább a mezekhez
          </Link>
        </div>
      </div>
    </Layout>
  );
}