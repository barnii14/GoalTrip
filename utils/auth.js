import { apiFetch } from "./api";

const AUTH_TOKEN_KEY = "goaltrip_token";
const AUTH_USER_KEY = "goaltrip_user";

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function setAuth(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("goaltrip-auth-updated"));
}

export async function refreshCurrentUser() {
  const response = await apiFetch("/api/auth/me");

  if (!response.ok) {
    throw new Error("Failed to refresh current user");
  }

  const payload = await response.json();
  const user = payload.data?.user;
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("goaltrip-auth-updated"));
  }
  return user;
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event("goaltrip-auth-updated"));
}
