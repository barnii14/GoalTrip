import React from "react";
import Layout from "../components/Layout";
import { readCart, writeCart } from "../utils/cart";

export default function CustomJerseyPage() {
  const [name, setName] = React.useState("PLAYER");
  const [number, setNumber] = React.useState("10");
  const [color, setColor] = React.useState("#0a5b45");
  const [pattern, setPattern] = React.useState("plain");
  const [nameFont, setNameFont] = React.useState("Georgia, serif");
  const [numberFont, setNumberFont] = React.useState("Georgia, serif");
  const [size, setSize] = React.useState("M");

  const patternStyle = (() => {
    switch (pattern) {
      case "stripe":
        return {
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 10px, transparent 10px, transparent 24px)"
        };
      case "horizontal":
        return {
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 10px, transparent 10px, transparent 24px)"
        };
      case "diagonal":
        return {
          backgroundImage:
            "repeating-linear-gradient(-45deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 10px, transparent 10px, transparent 24px)"
        };
      case "dots":
        return {
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.14) 10%, transparent 11%)",
          backgroundSize: "20px 20px"
        };
      default:
        return {};
    }
  })();

 const addToCart = () => {
  const cart = readCart();

  const existingIndex = cart.findIndex(
    (item) =>
      item.type === "custom-jersey" &&
      item.name === (name || "PLAYER") &&
      item.number === (number || "10") &&
      item.color === color &&
      item.pattern === pattern &&
      item.nameFont === nameFont &&
      item.numberFont === numberFont &&
      item.size === size
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
  } else {
    const customJersey = {
      id: Date.now(),
      type: "custom-jersey",
      title: "Egyedi mez",
      name: name || "PLAYER",
      number: number || "10",
      color,
      pattern,
      nameFont,
      numberFont,
      size,
      quantity: 1
    };

    cart.push(customJersey);
  }

  writeCart(cart);
  alert("Az egyedi mez bekerült a kosárba.");
};

  return (
    <Layout>
      <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)", marginBottom: "30px" }}>Egyedi mez</h1>

      <div className="gt-custom-jersey-grid">
        <div style={{ background: "#1a1a1a", borderRadius: "20px", padding: "30px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 style={{ color: "#39ff88", textAlign: "center", fontSize: "2rem", marginBottom: "25px" }}>
            Mez beállítások
          </h2>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Név</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Szám</label>
            <input value={number} onChange={(e) => setNumber(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Szín</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Minta</label>
            <select value={pattern} onChange={(e) => setPattern(e.target.value)} style={inputStyle}>
              <option value="plain">Sima</option>
              <option value="stripe">Csíkos</option>
              <option value="horizontal">Vízszintes</option>
              <option value="diagonal">Átlós</option>
              <option value="dots">Pöttyös</option>
            </select>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Név betűstílus</label>
            <select value={nameFont} onChange={(e) => setNameFont(e.target.value)} style={inputStyle}>
              <option value="Georgia, serif">Klasszikus</option>
              <option value="Arial, sans-serif">Modern</option>
              <option value="Impact, sans-serif">Sportos</option>
              <option value="'Courier New', monospace">Digitális</option>
            </select>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Szám betűstílus</label>
            <select value={numberFont} onChange={(e) => setNumberFont(e.target.value)} style={inputStyle}>
              <option value="Georgia, serif">Klasszikus</option>
              <option value="Arial, sans-serif">Modern</option>
              <option value="Impact, sans-serif">Sportos</option>
              <option value="'Courier New', monospace">Digitális</option>
            </select>
          </div>
          <div style={{ marginBottom: "18px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Méret
        </label>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          style={inputStyle}
       >
         <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
  </select>
</div>

          <button onClick={addToCart} style={buttonStyle}>Kosárba</button>
        </div>

        <div style={{ background: "#1a1a1a", borderRadius: "20px", padding: "30px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 style={{ color: "#39ff88", textAlign: "center", fontSize: "2rem", marginBottom: "25px" }}>Előnézet</h2>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "520px" }}>
            <div
              style={{
                position: "relative",
                width: "260px",
                height: "340px",
                backgroundColor: color,
                borderRadius: "30px 30px 50px 50px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
                ...patternStyle
              }}
            >
              <div style={{ position: "absolute", left: "-55px", top: "20px", width: "95px", height: "110px", backgroundColor: color, borderRadius: "25px", transform: "rotate(18deg)" }} />
              <div style={{ position: "absolute", right: "-55px", top: "20px", width: "95px", height: "110px", backgroundColor: color, borderRadius: "25px", transform: "rotate(-18deg)" }} />
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "90px", height: "40px", background: "black", borderRadius: "0 0 25px 25px", zIndex: 3 }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "30px 30px 50px 50px", boxShadow: "inset 0 0 40px rgba(0,0,0,0.2)" }} />

              <div style={{ position: "relative", zIndex: 5, marginBottom: "14px", fontSize: "1.2rem" }}>GOALTRIP</div>
              <div style={{ position: "relative", zIndex: 5, fontSize: "2.2rem", fontWeight: "bold", fontFamily: nameFont, textTransform: "uppercase" }}>
                {name || "PLAYER"}
              </div>
              <div style={{ position: "relative", zIndex: 5, fontSize: "5rem", fontWeight: "bold", fontFamily: numberFont }}>
                {number || "10"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const inputStyle = {
  width: "100%",
  height: "48px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#2a2a2a",
  color: "white",
  padding: "0 14px"
};

const buttonStyle = {
  width: "100%",
  marginTop: "10px",
  padding: "14px",
  background: "#39ff88",
  color: "black",
  border: "none",
  borderRadius: "999px",
  fontWeight: "bold",
  cursor: "pointer"
};