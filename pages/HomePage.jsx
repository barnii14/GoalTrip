import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function HomePage() {
  return (
    <Layout>
      <section className="gt-hero">
        <div className="gt-hero-overlay" />

        <div className="gt-hero-content">
          <div className="gt-hero-badge">🏆 Hivatalos mérkőzésnapi élmények</div>

          <h1 className="gt-hero-title">
            Lépj be te is a <span>Football</span>
            <br />
            világába
          </h1>

          <p className="gt-hero-text">
            Felejthetetlen futball élmények. Prémium utazási csomagok, hivatalos jegyek és
            egyedi mezek.
          </p>

          <div className="gt-hero-actions">
            <Link to="/utazasi-csomagok" className="gt-btn gt-btn-primary gt-hero-btn">
              Mérkőzés utak felfedezése →
            </Link>

            <Link to="/mezek" className="gt-btn gt-btn-secondary gt-hero-btn">
              Mezek vásárlása
            </Link>
          </div>
        </div>
      </section>

      <section className="gt-newsletter">
        <div className="gt-newsletter-left">
          <h2>Ne Maradj Le Egyetlen Meccsről Sem</h2>
          <p>
            Iratkozz fel exkluzív ajánlatokért, korai jegyhozzáférésért és a
            legfrissebb futballutazási hírekért
          </p>
        </div>

        <form
          className="gt-newsletter-form"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Sikeres feliratkozás! (demo)");
          }}
        >
          <input type="email" placeholder="Add meg az email címed" />
          <button type="submit" className="gt-btn gt-btn-primary">
            Feliratkozás
          </button>
        </form>
      </section>

      <section className="gt-home-footer">
        <div className="gt-home-footer-col gt-home-footer-brand">
          <div className="gt-home-footer-logo">GOALTRIP</div>

          <p>
            Megbízható partnered felejthetetlen futball élményekhez szerte a világon.
          </p>

          <p>
            Prémium utazás, hiteles termékek, életre szóló emlékek.
          </p>
        </div>

        <div className="gt-home-footer-col">
          <h3>Gyors Linkek</h3>
          <Link to="/utazasi-csomagok">Utazási Csomagok</Link>
          <Link to="/mezek">Hivatalos Mezek</Link>
          <Link to="/egyedi-mez">Egyedi Mezek</Link>
          <Link to="/rolunk">Rólunk</Link>
        </div>

        <div className="gt-home-footer-col">
          <h3>Támogatás</h3>
          <a href="#">GYIK</a>
          <a href="#">Kapcsolat</a>
          <a href="#">Szállítási Információk</a>
          <a href="#">Visszaküldés &amp; Csere</a>
          <a href="#">Fizetési Lehetőségek</a>
          <a href="#">Adatvédelem</a>
        </div>

        <div className="gt-home-footer-col">
          <h3>Elérhetőség</h3>
          <p>📍 7633 Pécs Esztergár Lajos utca 6.</p>
          <p>📞 +36 30 8995773</p>
          <p>✉️ info@goaltrip.hu</p>
        </div>
      </section>
    </Layout>
  );
}