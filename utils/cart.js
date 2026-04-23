export function readCart() {
  try {
    const raw = localStorage.getItem("goaltrip-cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function writeCart(cart) {
  localStorage.setItem("goaltrip-cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("goaltrip-cart-updated"));
}