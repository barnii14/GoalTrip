import { getToken } from "./auth";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost/backend";

export function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
}
