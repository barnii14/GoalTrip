import React from "react";
import Layout from "../components/Layout";
import { readCart, writeCart } from "../utils/cart";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { getUser } from "../utils/auth";

export default function CheckoutPage() {
  const [cart, setCart] = React.useState([]);
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [note, setNote] = React.useState(""); 
  const navigate = useNavigate();

  React.useEffect(() => {
    setCart(readCart());

    const user = getUser();
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
    }
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    writeCart(updatedCart);
  };

  const updateQuantity = (id, change) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          const newQuantity = (item.quantity || 1) + change;
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter((item) => (item.quantity || 1) > 0);

    setCart(updatedCart);
    writeCart(updatedCart);
  };

  const totalPrice = cart.reduce((sum, item) => {
  return sum + (item.price || 0) * (item.quantity || 1);
}, 0);

const handleOrder = async () => {
  if (!fullName || !email || !phone || !address) {
    alert("Kérlek töltsd ki az összes kötelező mezőt.");
    return;
  }

  if (cart.length === 0) {
    alert("A kosár üres.");
    return;
  }

  const orderData = {
    customer: {
      name: fullName,
      email,
      phone,
      address,
      note
    },
    items: cart.map((item) => ({
      productId: item.productId,
      team: item.team,
      variant: item.variant,
      size: item.size,
      qty: item.quantity || 1,
      price: item.price
    })),
    shipping: "Hazhozszallitas",
    payment: "Kartya"
  };

  try {
    const response = await apiFetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    if (!response.ok) {
      alert(result.error || "Hiba történt a rendelés leadásakor.");
      return;
    }

    writeCart([]);
    setCart([]);
    setFullName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setNote("");

    navigate("/order-success");
  } catch (err) {
    console.error("Hiba a rendelés küldésekor:", err);
    alert("Hiba történt a rendelés leadásakor.");
  }
};

  return (
    <Layout>
      <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)", marginBottom: "30px" }}>Kosár</h1>

      {cart.length === 0 ? (
        <p style={{ color: "#bbbbbb" }}>A kosár jelenleg üres.</p>
      ) : (
        <div className="gt-checkout-grid">
          <div style={{ display: "grid", gap: "16px" }}>
           {cart.map((item) => (
  <div
    key={item.id}
    style={{
      background: "#1a1a1a",
      borderRadius: "18px",
      padding: "18px",
      border: "1px solid rgba(255,255,255,0.08)"
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: item.image ? "110px 1fr" : "1fr",
        gap: "16px",
        alignItems: "start"
      }}
    >
      {item.image ? (
  <img
    src={`/${item.image}`}
    alt={item.title || "Termék"}
    style={{
      width: "110px",
      height: "110px",
      objectFit: "cover",
      borderRadius: "14px",
      background: "#111"
    }}
  />
) : item.type === "custom-jersey" ? (
  <div
    style={{
      width: "110px",
      height: "140px",
      backgroundColor: item.color || "#0a5b45",
      borderRadius: "18px 18px 26px 26px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      boxShadow: "0 10px 24px rgba(0,0,0,0.3)"
    }}
  >
    <div
      style={{
        position: "absolute",
        left: "-18px",
        top: "14px",
        width: "28px",
        height: "42px",
        backgroundColor: item.color || "#0a5b45",
        borderRadius: "10px",
        transform: "rotate(18deg)"
      }}
    />
    <div
      style={{
        position: "absolute",
        right: "-18px",
        top: "14px",
        width: "28px",
        height: "42px",
        backgroundColor: item.color || "#0a5b45",
        borderRadius: "10px",
        transform: "rotate(-18deg)"
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "34px",
        height: "16px",
        background: "black",
        borderRadius: "0 0 10px 10px"
      }}
    />
    <div style={{ fontSize: "10px", marginBottom: "6px", zIndex: 2 }}>
      GOALTRIP
    </div>
    <div
      style={{
        fontSize: "14px",
        textTransform: "uppercase",
        zIndex: 2,
        textAlign: "center",
        lineHeight: "1.1",
        padding: "0 6px"
      }}
    >
      {item.name || "PLAYER"}
    </div>
    <div style={{ fontSize: "28px", lineHeight: 1, zIndex: 2 }}>
      {item.number || "10"}
    </div>
  </div>
) : null}

      <div>
        <h2 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>
          {item.title || "Termék"}
        </h2>

        {item.subtitle && (
          <p style={{ color: "#bbbbbb", marginBottom: "6px" }}>
            {item.subtitle}
          </p>
        )}

        {item.size && (
          <p style={{ color: "#bbbbbb", marginBottom: "6px" }}>
            Méret: {item.size}
          </p>
        )}

        {item.type === "custom-jersey" && (
        <div style={{ color: "#bbbbbb", marginBottom: "10px", lineHeight: "1.6" }}>
        <div>Név: {item.name}</div>
        <div>Szám: {item.number}</div>
        <div>Minta: {item.pattern}</div>
        <div>Méret: {item.size}</div>
      </div>
    )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "14px"
          }}
        >
          <div>
            <div style={{ color: "#bbbbbb", marginBottom: "4px" }}>Egységár</div>
            <div style={{ fontWeight: "bold" }}>
              {(item.price || 0).toLocaleString()} Ft
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#111",
              borderRadius: "999px",
              padding: "6px 10px"
            }}
          >
            <button onClick={() => updateQuantity(item.id, -1)} style={qtyBtnStyle(false)}>
              -
            </button>

            <span style={{ minWidth: "24px", textAlign: "center", fontWeight: "bold" }}>
              {item.quantity || 1}
            </span>

            <button onClick={() => updateQuantity(item.id, 1)} style={qtyBtnStyle(true)}>
              +
            </button>
          </div>

          <div>
            <div style={{ color: "#bbbbbb", marginBottom: "4px" }}>Részösszeg</div>
            <div style={{ fontWeight: "bold" }}>
              {((item.price || 0) * (item.quantity || 1)).toLocaleString()} Ft
            </div>
          </div>
        </div>

        <button onClick={() => removeFromCart(item.id)} style={removeBtnStyle}>
          Törlés
        </button>
      </div>
    </div>
  </div>
))}
          </div>

<div className="gt-checkout-sidebar">
  <h2 style={{ fontSize: "1.5rem", marginBottom: "18px" }}>Összegzés</h2>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "14px",
      color: "#bbbbbb"
    }}
  >
    <span>Tételek száma</span>
    <span>{cart.length} db</span>
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "24px",
      fontSize: "1.2rem",
      fontWeight: "bold"
    }}
  >
    <span>Végösszeg</span>
    <span>{totalPrice.toLocaleString()} Ft</span>
  </div>

  <h3 style={{ fontSize: "1.2rem", marginBottom: "14px" }}>Szállítási adatok</h3>

  <div style={{ display: "grid", gap: "12px" }}>
    <input
      type="text"
      placeholder="Teljes név *"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      style={checkoutInputStyle}
    />

    <input
      type="email"
      placeholder="Email cím *"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      style={checkoutInputStyle}
    />

    <input
      type="text"
      placeholder="Telefonszám *"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      style={checkoutInputStyle}
    />

    <input
      type="text"
      placeholder="Szállítási cím *"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      style={checkoutInputStyle}
    />

    <textarea
      placeholder="Megjegyzés"
      value={note}
      onChange={(e) => setNote(e.target.value)}
      style={checkoutTextareaStyle}
    />
  </div>

  <button onClick={handleOrder} style={{ ...checkoutBtnStyle, marginTop: "18px" }}>
    Rendelés leadása
  </button>
</div>
        </div>
      )}
    </Layout>
  );
}

const qtyBtnStyle = (plus) => ({
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  border: "none",
  background: plus ? "#39ff88" : "#2a2a2a",
  color: plus ? "black" : "white",
  fontWeight: "bold",
  cursor: "pointer"
});

const removeBtnStyle = {
  marginTop: "16px",
  padding: "10px 16px",
  borderRadius: "999px",
  border: "none",
  background: "#ff4d4f",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};

const checkoutBtnStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "999px",
  border: "none",
  background: "#39ff88",
  color: "black",
  fontWeight: "bold",
  cursor: "pointer"
};
const checkoutInputStyle = {
  width: "100%",
  height: "46px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#111",
  color: "white",
  padding: "0 14px",
  outline: "none",
  boxSizing: "border-box"
};

const checkoutTextareaStyle = {
  width: "100%",
  minHeight: "90px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#111",
  color: "white",
  padding: "12px 14px",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box"
};