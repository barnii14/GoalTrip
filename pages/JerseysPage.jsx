import React from "react";
import Layout from "../components/Layout";
import { readCart, writeCart } from "../utils/cart";
import { apiFetch } from "../utils/api";

export default function JerseysPage() {
  const [jerseys, setJerseys] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedLeague, setSelectedLeague] = React.useState("all");
  const [selectedTeam, setSelectedTeam] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeTeam, setActiveTeam] = React.useState(null);
  const [activeKitType, setActiveKitType] = React.useState("home");
  const [selectedSizes, setSelectedSizes] = React.useState({});

  React.useEffect(() => {
    apiFetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const cleaned = data.filter(
          (jersey) => jersey.image && !jersey.image.includes("third")
        );

        setJerseys(cleaned);

        const initialSizes = {};
        cleaned.forEach((jersey) => {
          initialSizes[jersey.id] = jersey.sizes?.[0] || "M";
        });
        setSelectedSizes(initialSizes);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Hiba a mezek betöltésekor:", err);
        setLoading(false);
      });
  }, []);

  const leagues = [...new Set(jerseys.map((j) => j.league))];

  const teams = [
    ...new Set(
      jerseys
        .filter((j) => selectedLeague === "all" || j.league === selectedLeague)
        .map((j) => j.team)
    ),
  ];

  const filteredJerseys = jerseys.filter((jersey) => {
    const matchesLeague =
      selectedLeague === "all" || jersey.league === selectedLeague;

    const matchesTeam = selectedTeam === "all" || jersey.team === selectedTeam;

    const matchesSearch =
      jersey.team.toLowerCase().includes(search.toLowerCase()) ||
      jersey.name.toLowerCase().includes(search.toLowerCase());

    return matchesLeague && matchesTeam && matchesSearch;
  });

  const groupedTeams = filteredJerseys.reduce((acc, jersey) => {
    if (!acc[jersey.league]) {
      acc[jersey.league] = {};
    }

    if (!acc[jersey.league][jersey.team]) {
      acc[jersey.league][jersey.team] = jersey;
    }

    return acc;
  }, {});

  const openModal = (teamName) => {
    const teamJerseys = jerseys.filter((j) => j.team === teamName);
    const hasHome = teamJerseys.some((j) => j.kitType === "home");
    const defaultType = hasHome ? "home" : teamJerseys[0]?.kitType || "home";

    setActiveTeam(teamName);
    setActiveKitType(defaultType);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveTeam(null);
  };

  const activeTeamJerseys = activeTeam
    ? jerseys.filter((j) => j.team === activeTeam)
    : [];

  const activeJersey =
    activeTeamJerseys.find((j) => j.kitType === activeKitType) ||
    activeTeamJerseys[0] ||
    null;

  const availableKitTypes = activeTeamJerseys.map((j) => j.kitType);

  const handleSizeChange = (jerseyId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [jerseyId]: size,
    }));
  };

  const addJerseyToCart = (jersey) => {
    const cart = readCart();
    const chosenSize = selectedSizes[jersey.id] || jersey.sizes?.[0] || "M";

    const existingIndex = cart.findIndex(
      (item) =>
        item.type === "jersey" &&
        item.productId === jersey.id &&
        item.variant === jersey.kitType &&
        item.size === chosenSize
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      const cartItem = {
        id: Date.now(),
        productId: jersey.id,
        type: "jersey",
        title: jersey.name,
        subtitle: `${jersey.team} - ${jersey.kitType}`,
        team: jersey.team,
        variant: jersey.kitType,
        price: jersey.price,
        image: jersey.image,
        size: chosenSize,
        quantity: 1,
      };

      cart.push(cartItem);
    }

    writeCart(cart);
    alert(`${jersey.name} (${chosenSize}) bekerült a kosárba.`);
  };

  return (
    <Layout>
      <section style={{ marginBottom: "34px", textAlign: "center" }}>
        <h1 className="gt-title" style={{ marginBottom: "12px" }}>
          Mezek (2025/26)
        </h1>
        <p className="gt-muted" style={{ fontSize: "1.15rem" }}>
          Válassz csapatot, kattints a kártyára – a részleteknél kiválaszthatod
          a mez típusát és a méretet.
        </p>
      </section>

      <div className="gt-panel" style={{ padding: "24px", marginBottom: "34px" }}>
        <div className="gt-jerseys-filter-grid">
          <div>
            <label style={labelStyle}>Bajnokság</label>
            <select
              value={selectedLeague}
              onChange={(e) => {
                setSelectedLeague(e.target.value);
                setSelectedTeam("all");
              }}
              style={filterStyle}
            >
              <option value="all">Összes</option>
              {leagues.map((league) => (
                <option key={league} value={league}>
                  {league}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Csapat</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              style={filterStyle}
            >
              <option value="all">Összes</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Keresés</label>
            <input
              type="text"
              placeholder="Pl.: Barcelona, Bayern, Arsenal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={filterStyle}
            />
          </div>

          <button
            className="gt-btn"
            onClick={() => {
              setSelectedLeague("all");
              setSelectedTeam("all");
              setSearch("");
            }}
            style={resetBtnStyle}
          >
            Visszaállítás
          </button>
        </div>

        <p className="gt-muted" style={{ marginTop: "18px", marginBottom: 0 }}>
          Találatok: {Object.values(groupedTeams).reduce((sum, teamsObj) => {
            return sum + Object.keys(teamsObj).length;
          }, 0)} /{" "}
          {[
            ...new Set(
              jerseys.map((j) => `${j.league}__${j.team}`)
            ),
          ].length}
        </p>
      </div>

      {loading ? (
        <p className="gt-muted">Mezek betöltése...</p>
      ) : (
        Object.entries(groupedTeams).map(([league, teamsObj]) => (
          <section key={league} className="gt-panel" style={{ padding: "20px", marginBottom: "32px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: 900 }}>
                {league}
              </h2>
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  background: "linear-gradient(90deg, #1aff72, transparent)",
                  opacity: 0.45,
                }}
              />
            </div>

            <div className="gt-grid gt-grid-3">
              {Object.values(teamsObj).map((teamCard) => (
                <div
                  key={`${teamCard.league}-${teamCard.team}`}
                  className="gt-card"
                  onClick={() => openModal(teamCard.team)}
                  style={{
                    cursor: "pointer",
                    padding: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      minHeight: "210px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "radial-gradient(circle at 50% 30%, rgba(57,255,136,0.12), transparent 40%), linear-gradient(90deg, rgba(20,80,25,0.7), rgba(10,10,10,0.95))",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "14px",
                        padding: "7px 14px",
                        borderRadius: "999px",
                        background: "rgba(12, 130, 40, 0.35)",
                        border: "1px solid rgba(57,255,136,0.22)",
                        color: "#39ff88",
                        fontWeight: 900,
                        fontSize: "1.1rem",
                      }}
                    >
                      2025/26
                    </div>

                    <div
                      style={{
                        width: "118px",
                        height: "118px",
                        borderRadius: "28px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                      }}
                    >
                      <img
                        src={`/${teamCard.image}`}
                        alt={teamCard.team}
                        style={{
                          width: "78px",
                          height: "78px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ padding: "18px 20px 20px" }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "2rem",
                        fontWeight: 900,
                      }}
                    >
                      {teamCard.team}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      {modalOpen && activeJersey && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div
            style={modalContainerStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={closeBtnStyle} onClick={closeModal}>
              ✕
            </button>

            <div
              style={{
                padding: "26px 28px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                background:
                  "radial-gradient(circle at center, rgba(57,255,136,0.10), transparent 45%), linear-gradient(90deg, rgba(5,60,30,0.7), rgba(0,20,60,0.55))",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                }}
              >
                <div
                  style={{
                    width: "106px",
                    height: "106px",
                    borderRadius: "24px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={`/${activeJersey.image}`}
                    alt={activeJersey.team}
                    style={{
                      width: "72px",
                      height: "72px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div>
                  <div className="gt-muted" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                    {activeJersey.league}
                  </div>
                  <h2 style={{ margin: "8px 0", fontSize: "3rem", fontWeight: 900 }}>
                    {activeJersey.team}
                  </h2>
                  <div style={{ color: "#39ff88", fontSize: "2rem", fontWeight: 900 }}>
                    2025/26
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "24px",
                padding: "24px",
              }}
            >
              <div
                className="gt-panel"
                style={{
                  padding: "12px",
                  minHeight: "580px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f2f2f2",
                }}
              >
                <img
                  src={`/${activeJersey.image}`}
                  alt={activeJersey.name}
                  style={{
                    width: "100%",
                    maxHeight: "540px",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div style={{ display: "grid", gap: "18px", alignContent: "start" }}>
                <div className="gt-panel" style={{ padding: "22px" }}>
                  <h3 style={{ marginTop: 0, marginBottom: "18px", fontSize: "1.8rem" }}>
                    Mez típusa
                  </h3>

                  <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
                    {availableKitTypes.includes("home") && (
                      <button
                        className="gt-btn"
                        onClick={() => {
                          const homeJersey = activeTeamJerseys.find((j) => j.kitType === "home");
                          if (homeJersey) {
                            setActiveKitType("home");
                          }
                        }}
                        style={activeKitType === "home" ? kitBtnActiveStyle : kitBtnStyle}
                      >
                        Hazai
                      </button>
                    )}

                    {availableKitTypes.includes("away") && (
                      <button
                        className="gt-btn"
                        onClick={() => {
                          const awayJersey = activeTeamJerseys.find((j) => j.kitType === "away");
                          if (awayJersey) {
                            setActiveKitType("away");
                          }
                        }}
                        style={activeKitType === "away" ? kitBtnActiveStyle : kitBtnStyle}
                      >
                        Vendég
                      </button>
                    )}
                  </div>

                  <p className="gt-muted" style={{ marginBottom: 0, fontSize: "1.5rem" }}>
                    2025/26 {activeKitType === "home" ? "Hazai mez" : "Vendég mez"}
                  </p>
                </div>

                <div className="gt-panel" style={{ padding: "22px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "18px",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#39ff88",
                          fontSize: "2.5rem",
                          fontWeight: 900,
                        }}
                      >
                        {activeJersey.price.toLocaleString()} Ft
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Méret</label>
                      <select
                        value={
                          selectedSizes[activeJersey.id] ||
                          activeJersey.sizes?.[0] ||
                          "M"
                        }
                        onChange={(e) =>
                          handleSizeChange(activeJersey.id, e.target.value)
                        }
                        style={filterStyle}
                      >
                        {(activeJersey.sizes && activeJersey.sizes.length > 0
                          ? activeJersey.sizes
                          : ["S", "M", "L", "XL", "XXL"]
                        ).map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>

                      <p className="gt-muted" style={{ marginTop: "12px", marginBottom: 0 }}>
                        Válassz méretet a kosárhoz.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => addJerseyToCart(activeJersey)}
                    className="gt-btn gt-btn-primary"
                    style={{
                      width: "100%",
                      marginTop: "28px",
                      padding: "16px",
                      fontSize: "1.2rem",
                    }}
                  >
                    Kosárba
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "bold",
  color: "#f5f5f7",
  fontSize: "1.25rem",
};

const filterStyle = {
  height: "56px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#1a1a1a",
  color: "white",
  padding: "0 16px",
  boxSizing: "border-box",
  width: "100%",
  fontSize: "1.1rem",
};

const resetBtnStyle = {
  background: "rgba(255,255,255,0.06)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.12)",
  height: "56px",
  padding: "0 24px",
};

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.72)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  padding: "clamp(10px, 3vw, 28px)",
};

const modalContainerStyle = {
  width: "min(1200px, 96vw)",
  maxHeight: "92vh",
  overflowY: "auto",
  borderRadius: "28px",
  background: "#071028",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
  position: "relative",
};

const closeBtnStyle = {
  position: "absolute",
  top: "18px",
  right: "18px",
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  fontSize: "1.6rem",
  cursor: "pointer",
  zIndex: 20,
};

const kitBtnStyle = {
  background: "rgba(255,255,255,0.08)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.12)",
  padding: "12px 22px",
  fontSize: "1.05rem",
};

const kitBtnActiveStyle = {
  background: "rgba(57,255,136,0.14)",
  color: "#39ff88",
  border: "1px solid rgba(57,255,136,0.28)",
  padding: "12px 22px",
  fontSize: "1.05rem",
};