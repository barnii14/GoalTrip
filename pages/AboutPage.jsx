import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <Layout>
      
      {}
      <section style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 className="gt-title" style={{ fontSize: "3rem" }}>
          Rólunk
        </h1>
        <p className="gt-muted" style={{ maxWidth: "700px", margin: "0 auto" }}>
          A GoalTrip célja, hogy közelebb hozza hozzád a futball világát – akár a lelátón,
          akár a pályán kívül.
        </p>
      </section>

      {}
      <section
        className="gt-panel"
        style={{
          padding: "32px",
          marginBottom: "50px",
          maxWidth: "900px",
          marginInline: "auto"
        }}
      >
        <p style={{ lineHeight: "1.7", fontSize: "1.05rem" }}>
          A GoalTrip egy olyan platform, amely a futball szerelmeseinek készült.
          Nálunk megtalálod a legjobb utazási csomagokat, hivatalos mezeket és egyedi
          termékeket – mindezt egy helyen.
        </p>

        <p style={{ lineHeight: "1.7", fontSize: "1.05rem" }}>
          Célunk, hogy felejthetetlen élményeket nyújtsunk: legyen szó egy stadion
          látogatásról, egy meccsnapról vagy akár egy saját, személyre szabott mezről.
        </p>

        <p style={{ lineHeight: "1.7", fontSize: "1.05rem" }}>
          Hiszünk abban, hogy a futball több mint játék – közösség, élmény és életérzés.
        </p>
      </section>

      {}
      <section style={{ marginBottom: "60px" }}>
        <h2 className="gt-title" style={{ textAlign: "center" }}>
          Miért válassz minket?
        </h2>

        <div className="gt-grid gt-grid-3">
          
          <div className="gt-card">
            <h3>⚽ Prémium élmények</h3>
            <p className="gt-muted">
              Exkluzív mérkőzés utak és stadion élmények Európa top ligáiban.
            </p>
          </div>

          <div className="gt-card">
            <h3>👕 Hivatalos mezek</h3>
            <p className="gt-muted">
              Csak megbízható forrásból származó, eredeti termékek.
            </p>
          </div>

          <div className="gt-card">
            <h3>🎨 Egyedi design</h3>
            <p className="gt-muted">
              Készíts saját mezt, saját névvel és stílussal.
            </p>
          </div>

          <div className="gt-card">
            <h3>🚀 Gyors rendelés</h3>
            <p className="gt-muted">
              Egyszerű vásárlás és gyors feldolgozás.
            </p>
          </div>

          <div className="gt-card">
            <h3>💬 Támogatás</h3>
            <p className="gt-muted">
              Segítünk, ha kérdésed van – valódi ügyfélszolgálat.
            </p>
          </div>

          <div className="gt-card">
            <h3>🌍 Nemzetközi</h3>
            <p className="gt-muted">
              Több liga, több csapat, több élmény – egy helyen.
            </p>
          </div>

        </div>
      </section>

      {}
      <section
        className="gt-panel"
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Készen állsz a következő élményre?
        </h2>

        <Link to="/mezek" className="gt-btn gt-btn-primary">
          Mezek megtekintése
        </Link>
      </section>

    </Layout>
  );
}