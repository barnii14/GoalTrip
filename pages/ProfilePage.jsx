import React from "react";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { isLoggedIn, getUser } from "../utils/auth";

export default function ProfilePage() {
  const [loading, setLoading] = React.useState(true);
  const savedUser = getUser();
  const [profile, setProfile] = React.useState({
    fullName: savedUser?.name || "",
    email: savedUser?.email || "",
    phone: "",
    address: ""
  });
  const [orders, setOrders] = React.useState([]);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadProfileData = async () => {
      if (!isLoggedIn()) {
        navigate("/bejelentkezes");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const profileResponse = await apiFetch("/api/auth/me");
        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(profileData.error || "Nem sikerült lekérni a profiladatokat.");
        }

        const user = profileData.data?.user || profileData.user || {};
        setProfile({
          fullName: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || ""
        });

        const ordersResponse = await apiFetch("/api/orders");
        const ordersData = await ordersResponse.json();

        if (!ordersResponse.ok) {
          throw new Error(ordersData.error || "Nem sikerült lekérni a rendeléseket.");
        }

        const mappedOrders = Array.isArray(ordersData)
          ? ordersData.map((order) => ({
              id: order.rendeles_id,
              createdAt: order.datum,
              status: mapOrderStatus(order.allapot),
              total: Number(order.osszeg ?? 0),
              items: (order.items || []).map((item, index) => ({
                id: String(item.termek_id ?? `${order.rendeles_id}-${index}`),
                type: "jersey",
                title: item.csapatnev ? `${item.csapatnev} mez` : item.title || "Mez",
                subtitle: item.csapatnev ? `${item.csapatnev}` : item.subtitle,
                image: item.kep_url || item.image,
                price: Number(item.ar ?? item.price ?? 0),
                quantity: Number(item.darabszam ?? item.qty ?? item.quantity ?? 1),
                size: item.size_name || item.size,
              })),
              customer: {
                fullName: order.nev ?? "",
                email: order.email ?? "",
                phone: order.telefon ?? "",
                address: order.cim ?? ""
              }
            }))
          : [];

        setOrders(mappedOrders);
      } catch (err) {
        console.error(err);
        setError("Nem sikerült betölteni a profil adatokat.");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Kiszállítva":
        return "#39ff88";
      case "Feldolgozás alatt":
        return "#ffd166";
      case "Törölve":
        return "#ff4d4f";
      default:
        return "#cccccc";
    }
  };

  const mapOrderStatus = (status) => {
    if (!status) {
      return "Ismeretlen";
    }

    const normalized = String(status).toLowerCase();
    if (normalized.includes("feldolgo")) {
      return "Feldolgozás alatt";
    }
    if (normalized.includes("kiszallit")) {
      return "Kiszállítva";
    }
    if (normalized.includes("torol")) {
      return "Törölve";
    }

    return status;
  };

  return (
    <Layout>
      <section style={{ textAlign: "center", marginBottom: "34px" }}>
        <h1 className="gt-title" style={{ marginBottom: "12px" }}>
          Profil
        </h1>
        <p className="gt-muted" style={{ fontSize: "1.1rem" }}>
          Itt láthatod a profiladataidat és a korábbi rendeléseidet.
        </p>
      </section>

      {loading ? (
        <section className="gt-panel" style={{ padding: "24px" }}>
          <p className="gt-muted" style={{ margin: 0 }}>
            Betöltés...
          </p>
        </section>
      ) : error ? (
        <section className="gt-panel" style={{ padding: "24px" }}>
          <p style={{ color: "#ff6b6b", margin: 0 }}>{error}</p>
        </section>
      ) : (
        <>
          <section className="gt-profile-grid">
            <div className="gt-panel" style={{ padding: "24px" }}>
              <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Adataim</h2>

              <div style={{ display: "grid", gap: "14px" }}>
                <div>
                  <div className="gt-muted" style={{ marginBottom: "4px" }}>Teljes név</div>
                  <div>{profile?.fullName}</div>
                </div>

                <div>
                  <div className="gt-muted" style={{ marginBottom: "4px" }}>Email</div>
                  <div>{profile?.email}</div>
                </div>

                <div>
                  <div className="gt-muted" style={{ marginBottom: "4px" }}>Telefonszám</div>
                  <div>{profile?.phone}</div>
                </div>

                <div>
                  <div className="gt-muted" style={{ marginBottom: "4px" }}>Cím</div>
                  <div>{profile?.address}</div>
                </div>
              </div>

              <div style={{ marginTop: "22px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button className="gt-btn gt-btn-secondary">
                  Adatok szerkesztése
                </button>
              </div>
            </div>

            <div className="gt-panel" style={{ padding: "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px"
                }}
              >
                <div className="gt-card" style={{ padding: "18px" }}>
                  <div className="gt-muted" style={{ marginBottom: "6px" }}>Rendelések</div>
                  <div style={{ fontSize: "2rem", fontWeight: 900 }}>{orders.length}</div>
                </div>

                <div className="gt-card" style={{ padding: "18px" }}>
                  <div className="gt-muted" style={{ marginBottom: "6px" }}>Aktív rendelések</div>
                  <div style={{ fontSize: "2rem", fontWeight: 900 }}>
                    {orders.filter((o) => o.status === "Feldolgozás alatt").length}
                  </div>
                </div>

                <div className="gt-card" style={{ padding: "18px" }}>
                  <div className="gt-muted" style={{ marginBottom: "6px" }}>Összes költés</div>
                  <div style={{ fontSize: "2rem", fontWeight: 900 }}>
                    {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()} Ft
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="gt-panel" style={{ padding: "24px", marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap"
              }}
            >
              <div>
                <h2 style={{ margin: 0, marginBottom: "8px" }}>Rendeléseim</h2>
                <p className="gt-muted" style={{ margin: 0 }}>
                  Korábbi vásárlások és állapotuk
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link to="/mezek" className="gt-btn gt-btn-secondary" style={{ textDecoration: "none" }}>
                  Mezek
                </Link>
                <Link to="/checkout" className="gt-btn gt-btn-secondary" style={{ textDecoration: "none" }}>
                  Checkout
                </Link>
              </div>
            </div>
          </section>

          {orders.length === 0 ? (
            <section className="gt-panel" style={{ padding: "24px" }}>
              <h3 style={{ marginTop: 0 }}>Még nincs rendelésed</h3>
              <p className="gt-muted" style={{ marginBottom: 0 }}>
                Ha majd rendelsz, itt fognak megjelenni a rendeléseid.
              </p>
            </section>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {orders.map((order) => (
                <section key={order.id} className="gt-panel" style={{ padding: "22px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      flexWrap: "wrap",
                      marginBottom: "18px"
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, marginBottom: "8px" }}>
                        Rendelés #{order.id}
                      </h3>
                      <p className="gt-muted" style={{ margin: 0 }}>
                        {new Date(order.createdAt).toLocaleString("hu-HU")}
                      </p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          color: getStatusColor(order.status),
                          fontWeight: 900,
                          fontSize: "1.05rem",
                          marginBottom: "6px"
                        }}
                      >
                        {order.status}
                      </div>
                      <div style={{ fontWeight: 900 }}>
                        {order.total.toLocaleString()} Ft
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: "14px" }}>
                    {order.items.map((item, index) => (
                      <div
                        key={`${order.id}-${index}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns: item.image ? "90px 1fr" : "1fr",
                          gap: "14px",
                          alignItems: "start",
                          padding: "14px",
                          borderRadius: "16px",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.05)"
                        }}
                      >
                        {item.image ? (
                          <img
                            src={`/${item.image}`}
                            alt={item.title || "Termék"}
                            style={{
                              width: "90px",
                              height: "90px",
                              objectFit: "cover",
                              borderRadius: "12px",
                              background: "#111"
                            }}
                          />
                        ) : item.type === "custom-jersey" ? (
                          <div
                            style={{
                              width: "90px",
                              height: "115px",
                              backgroundColor: item.color || "#0a5b45",
                              borderRadius: "16px 16px 22px 22px",
                              position: "relative",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold"
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                left: "-14px",
                                top: "12px",
                                width: "24px",
                                height: "34px",
                                backgroundColor: item.color || "#0a5b45",
                                borderRadius: "10px",
                                transform: "rotate(18deg)"
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                right: "-14px",
                                top: "12px",
                                width: "24px",
                                height: "34px",
                                backgroundColor: item.color || "#0a5b45",
                                borderRadius: "10px",
                                transform: "rotate(-18deg)"
                              }}
                            />
                            <div style={{ fontSize: "9px", marginBottom: "4px", zIndex: 2 }}>
                              GT
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                textTransform: "uppercase",
                                textAlign: "center",
                                lineHeight: "1.1",
                                padding: "0 4px",
                                zIndex: 2
                              }}
                            >
                              {item.name || "PLAYER"}
                            </div>
                            <div style={{ fontSize: "24px", lineHeight: 1, zIndex: 2 }}>
                              {item.number || "10"}
                            </div>
                          </div>
                        ) : null}

                        <div>
                          <h4 style={{ margin: 0, marginBottom: "6px" }}>
                            {item.title || "Termék"}
                          </h4>

                          {item.subtitle && (
                            <p className="gt-muted" style={{ margin: 0, marginBottom: "6px" }}>
                              {item.subtitle}
                            </p>
                          )}

                          {item.size && (
                            <p className="gt-muted" style={{ margin: 0, marginBottom: "6px" }}>
                              Méret: {item.size}
                            </p>
                          )}

                          {item.type === "custom-jersey" && (
                            <p className="gt-muted" style={{ margin: 0, marginBottom: "6px" }}>
                              Minta: {item.pattern}
                            </p>
                          )}

                          <p className="gt-muted" style={{ margin: 0 }}>
                            Darab: {item.quantity || 1} • Ár: {(item.price || 0).toLocaleString()} Ft
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}