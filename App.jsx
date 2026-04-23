import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TravelPackagesPage from "./pages/TravelPackagesPage";
import CustomJerseyPage from "./pages/CustomJerseyPage";
import JerseysPage from "./pages/JerseysPage";
import CheckoutPage from "./pages/CheckoutPage";
import AboutPage from "./pages/AboutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/utazasi-csomagok" element={<TravelPackagesPage />} />
        <Route path="/egyedi-mez" element={<CustomJerseyPage />} />
        <Route path="/mezek" element={<JerseysPage />} />
        <Route path="/rolunk" element={<AboutPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/bejelentkezes" element={<LoginPage />} />
        <Route path="/regisztracio" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}