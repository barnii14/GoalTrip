import React from "react";
import Layout from "../components/Layout";
import { readCart, writeCart } from "../utils/cart";

const packages = [
  {
    id: 1,
    title: "London Weekend Football Trip",
    duration: "2-3 nap • London",
    price: 129900,
    image: ""
  },
  {
    id: 2,
    title: "Stadium Experience – Barcelona",
    duration: "1-2 nap • Barcelona",
    price: 89900,
    image: ""
  },
  {
    id: 3,
    title: "City & Football – Rome",
    duration: "3-4 nap • Róma",
    price: 149900,
    image: ""
  },
  {
    id: 4,
    title: "El Clásico Experience",
    duration: "2-3 nap • Madrid",
    price: 179900,
    image: ""
  },
  {
    id: 5,
    title: "Der Klassiker Trip",
    duration: "2 nap • München",
    price: 139900,
    image: ""
  },
  {
    id: 6,
    title: "Premier League Weekend",
    duration: "3 nap • Manchester",
    price: 159900,
    image: ""
  },
  {
    id: 7,
    title: "Champions League Night",
    duration: "1 nap • Párizs",
    price: 99900,
    image: ""
  },
  {
    id: 8,
    title: "Milan Derby Experience",
    duration: "2 nap • Milánó",
    price: 149900,
    image: ""
  }
];

export default function TravelPackagesPage() {
  const addToCart = (pkg) => {
    const cart = readCart();

    cart.push({
      id: Date.now(),
      type: "package",
      title: pkg.title,
      subtitle: pkg.duration,
      price: pkg.price,
      image: pkg.image || "",
      quantity: 1
    });

    writeCart(cart);
    alert("Utazási csomag bekerült a kosárba.");
  };

  return (
    <Layout>
      <h1 className="gt-title">Utazási csomagok</h1>

      <div className="gt-grid gt-grid-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="gt-card"
            style={{
              overflow: "hidden"
            }}
          >
            {pkg.image ? (
              <img
                src={`/${pkg.image}`}
                alt={pkg.title}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                style={{
                  width: "100%",
                  height: "clamp(140px, 20vw, 180px)",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "12px"
                }}
              />
            ) : null}

            <h2 style={{ marginTop: pkg.image ? "0" : "6px" }}>{pkg.title}</h2>

            <p className="gt-muted" style={{ marginBottom: "10px" }}>
              {pkg.duration}
            </p>

            <div className="gt-price">{pkg.price.toLocaleString()} Ft</div>

            <button
              onClick={() => addToCart(pkg)}
              className="gt-btn gt-btn-primary"
              style={{ width: "100%" }}
            >
              Kosárba
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}