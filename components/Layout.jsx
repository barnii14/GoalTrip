import React from "react";
import { Link, NavLink } from "react-router-dom";
import { readCart } from "../utils/cart";
import { getUser, isLoggedIn, clearAuth, refreshCurrentUser } from "../utils/auth";

export default function Layout({ children }) {
  const [cartCount, setCartCount] = React.useState(0);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(isLoggedIn());
  const [user, setUser] = React.useState(getUser());

  React.useEffect(() => {
    const updateCartCount = () => {
      const cart = readCart();
      const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(count);
    };

    const updateAuthStatus = () => {
      setLoggedIn(isLoggedIn());
      setUser(getUser());
    };

    updateCartCount();
    updateAuthStatus();

    if (isLoggedIn()) {
      refreshCurrentUser().catch(() => {
        // ha lejárt a token, más helyen kezeljük
      });
    }

    window.addEventListener("goaltrip-cart-updated", updateCartCount);
    window.addEventListener("goaltrip-auth-updated", updateAuthStatus);

    return () => {
      window.removeEventListener("goaltrip-cart-updated", updateCartCount);
      window.removeEventListener("goaltrip-auth-updated", updateAuthStatus);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="gt-page">
      <header className="gt-header">
        <div className="gt-header-inner">
          <Link to="/" className="gt-logo">
            <img
              src="/logo.png"
              alt="GoalTrip"
              style={{
                height: "clamp(50px, 10vw, 100px)",
                objectFit: "contain",
                transform: "translateY(2px)"
              }}
            />
          </Link>

          <button className="gt-hamburger" onClick={toggleMenu} aria-label="Menü megnyitása">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`gt-nav ${isMenuOpen ? 'gt-nav-open' : ''}`}>
            <NavLink to="/" onClick={closeMenu}>Főoldal</NavLink>
            <NavLink to="/utazasi-csomagok" onClick={closeMenu}>Utazási csomagok</NavLink>
            <NavLink to="/egyedi-mez" onClick={closeMenu}>Egyedi mez</NavLink>
            <NavLink to="/mezek" onClick={closeMenu}>Mezek</NavLink>
            <NavLink to="/rolunk" onClick={closeMenu}>Rólunk</NavLink>
            <NavLink to="/profil" onClick={closeMenu}>Profil</NavLink>
            {loggedIn && user?.isAdmin ? (
              <NavLink to="/admin" onClick={closeMenu}>Admin Dashboard</NavLink>
            ) : null}
            {!loggedIn ? (
              <>
                <NavLink to="/bejelentkezes" onClick={closeMenu}>Bejelentkezés</NavLink>
                <NavLink to="/regisztracio" onClick={closeMenu}>Regisztráció</NavLink>
              </>
            ) : (
              <button
                className="gt-btn gt-btn-secondary"
                onClick={() => {
                  clearAuth();
                  closeMenu();
                }}
                style={{ marginLeft: 8 }}
              >
                Kijelentkezés
              </button>
            )}

            <Link to="/checkout" className="gt-cart-badge" onClick={closeMenu}>
              {cartCount}
            </Link>
          </nav>
        </div>
      </header>

      <main className="gt-main">{children}</main>
    </div>
  );
}