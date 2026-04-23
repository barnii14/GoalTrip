import React from "react";
import { Link, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../utils/api";
import { getUser, isLoggedIn } from "../utils/auth";

const ORDER_STATUSES = ["feldolgozas", "kiszallitva", "torolve"];

async function readJsonSafe(response) {
  const raw = await response.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getApiErrorMessage(payload, fallback, status) {
  const error = payload?.error;
  const details = payload?.details;
  if (error && details) {
    return `${error}: ${details}`;
  }
  if (error) {
    return error;
  }
  return `${fallback} (HTTP ${status})`;
}

export default function AdminDashboardPage() {
  const user = getUser();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [stats, setStats] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  const loadDashboard = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, usersRes, ordersRes, productsRes] = await Promise.all([
        apiFetch("/api/admin/stats"),
        apiFetch("/api/admin/users"),
        apiFetch("/api/admin/orders"),
        apiFetch("/api/admin/products"),
      ]);

      const [statsJson, usersJson, ordersJson, productsJson] = await Promise.all([
        readJsonSafe(statsRes),
        readJsonSafe(usersRes),
        readJsonSafe(ordersRes),
        readJsonSafe(productsRes),
      ]);

      if (!statsRes.ok) throw new Error(getApiErrorMessage(statsJson, "Nem sikerült a statisztika lekérés.", statsRes.status));
      if (!usersRes.ok) throw new Error(getApiErrorMessage(usersJson, "Nem sikerült a felhasználók lekérése.", usersRes.status));
      if (!ordersRes.ok) throw new Error(getApiErrorMessage(ordersJson, "Nem sikerült a rendelések lekérése.", ordersRes.status));
      if (!productsRes.ok) throw new Error(getApiErrorMessage(productsJson, "Nem sikerült a termékek lekérése.", productsRes.status));

      setStats(statsJson.data || {});
      setUsers(usersJson.data?.users || []);
      setOrders(ordersJson.data?.orders || []);
      setProducts(productsJson.data?.products || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Hiba történt az admin adatok betöltésekor.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const updateUserRole = async (selectedUser, nextIsAdmin) => {
    try {
      const response = await apiFetch(`/api/admin/users/${selectedUser.felhasznalo_id}/role`, {
        method: "PUT",
        body: JSON.stringify({ isAdmin: nextIsAdmin }),
      });
      const payload = await readJsonSafe(response);
      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nem sikerült a jogosultság módosítása.", response.status));
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.felhasznalo_id === selectedUser.felhasznalo_id ? { ...u, isAdmin: nextIsAdmin ? 1 : 0 } : u
        )
      );
    } catch (err) {
      alert(err.message || "Hiba történt.");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await apiFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      const payload = await readJsonSafe(response);
      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nem sikerült a rendelés frissítése.", response.status));
      }
      setOrders((prev) => prev.map((o) => (o.rendeles_id === orderId ? { ...o, allapot: status } : o)));
    } catch (err) {
      alert(err.message || "Hiba történt.");
    }
  };

  const updateProductPrice = async (productId, price) => {
    try {
      const response = await apiFetch(`/api/admin/products/${productId}/price`, {
        method: "PUT",
        body: JSON.stringify({ price: Number(price) }),
      });
      const payload = await readJsonSafe(response);
      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nem sikerült az ár módosítása.", response.status));
      }
      setProducts((prev) => prev.map((p) => (p.termek_id === productId ? { ...p, alap_ar_ft: Number(price) } : p)));
    } catch (err) {
      alert(err.message || "Hiba történt.");
    }
  };

  const toggleProductAvailability = async (product) => {
    const nextAvailable = Number(product.available) !== 1;
    try {
      const response = await apiFetch(`/api/admin/products/${product.termek_id}/availability`, {
        method: "PUT",
        body: JSON.stringify({ available: nextAvailable }),
      });
      const payload = await readJsonSafe(response);
      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nem sikerült az elérhetőség módosítása.", response.status));
      }
      await loadDashboard();
    } catch (err) {
      alert(err.message || "Hiba történt.");
    }
  };

  if (!isLoggedIn()) {
    return <Navigate to="/bejelentkezes" replace />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/profil" replace />;
  }

  return (
    <Layout>
      <section style={{ marginBottom: 20 }}>
        <h1 className="gt-title" style={{ marginBottom: 8 }}>Admin Dashboard</h1>
        <p className="gt-muted" style={{ margin: 0 }}>
          Felhasználók, rendelések és termékek központi kezelése.
        </p>
      </section>

      {loading ? (
        <section className="gt-panel" style={{ padding: 20 }}>Betöltés...</section>
      ) : error ? (
        <section className="gt-panel" style={{ padding: 20, color: "#ff6b6b" }}>{error}</section>
      ) : (
        <>
          <section className="gt-grid gt-grid-3" style={{ marginBottom: 24 }}>
            <div className="gt-card">
              <div className="gt-muted">Felhasználók</div>
              <div style={{ fontSize: "2rem", fontWeight: 900 }}>{stats?.usersCount ?? 0}</div>
            </div>
            <div className="gt-card">
              <div className="gt-muted">Rendelések</div>
              <div style={{ fontSize: "2rem", fontWeight: 900 }}>{stats?.ordersCount ?? 0}</div>
            </div>
            <div className="gt-card">
              <div className="gt-muted">Bevétel</div>
              <div style={{ fontSize: "2rem", fontWeight: 900 }}>
                {Number(stats?.totalRevenue ?? 0).toLocaleString("hu-HU")} Ft
              </div>
            </div>
          </section>

          <section className="gt-panel gt-admin-section">
            <div className="gt-admin-section-head">
              <h2>Felhasználók</h2>
            </div>
            <div className="gt-admin-table-wrap">
              <table className="gt-admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Név</th>
                    <th>Email</th>
                    <th>Szerep</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.felhasznalo_id}>
                      <td>{u.felhasznalo_id}</td>
                      <td>{u.nev}</td>
                      <td>{u.email}</td>
                      <td>
                        <button
                          className="gt-btn gt-btn-secondary"
                          onClick={() => updateUserRole(u, Number(u.isAdmin) !== 1)}
                        >
                          {Number(u.isAdmin) === 1 ? "Admin" : "User"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="gt-panel gt-admin-section">
            <div className="gt-admin-section-head">
              <h2>Rendelések</h2>
              <Link to="/profil" className="gt-btn gt-btn-secondary" style={{ textDecoration: "none" }}>Profil</Link>
            </div>
            <div className="gt-admin-table-wrap">
              <table className="gt-admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Vevő</th>
                    <th>Dátum</th>
                    <th>Összeg</th>
                    <th>Státusz</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.rendeles_id}>
                      <td>{o.rendeles_id}</td>
                      <td>{o.nev}</td>
                      <td>{new Date(o.datum).toLocaleString("hu-HU")}</td>
                      <td>{Number(o.osszeg ?? 0).toLocaleString("hu-HU")} Ft</td>
                      <td>
                        <select
                          className="gt-select"
                          style={{ minWidth: 180 }}
                          value={String(o.allapot || "feldolgozas")}
                          onChange={(e) => updateOrderStatus(o.rendeles_id, e.target.value)}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="gt-panel gt-admin-section">
            <div className="gt-admin-section-head">
              <h2>Termékek</h2>
            </div>
            <div className="gt-admin-table-wrap">
              <table className="gt-admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Termék</th>
                    <th>Készlet</th>
                    <th>Ár (Ft)</th>
                    <th>Elérhetőség</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 80).map((p) => (
                    <tr key={p.termek_id}>
                      <td>{p.termek_id}</td>
                      <td>{p.csapatnev} - {p.leiras}</td>
                      <td>{Number(p.keszlet ?? 0)}</td>
                      <td>
                        <input
                          className="gt-input"
                          type="number"
                          min="0"
                          defaultValue={Number(p.alap_ar_ft ?? 0)}
                          onBlur={(e) => updateProductPrice(p.termek_id, e.target.value)}
                          style={{ minWidth: 140 }}
                        />
                      </td>
                      <td>
                        <button className="gt-btn gt-btn-secondary" onClick={() => toggleProductAvailability(p)}>
                          {Number(p.available) === 1 ? "Elérhető" : "Rejtett"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="gt-muted" style={{ marginTop: 12, marginBottom: 0 }}>
              A lista teljes, de itt a gyorsabb kezelhetőség miatt az első 80 termék látható.
            </p>
          </section>
        </>
      )}
    </Layout>
  );
}
