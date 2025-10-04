// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const DEV = import.meta.env.VITE_DEV_MODE === "true";

function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch { return {}; }
}

function _url(path) {
  if (!path) return API_URL;
  return path.startsWith("http") ? path : `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function authHeaders() {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/** --- Dev auto-token + 401 retry --- */
let _refreshing = null;
async function ensureToken() {
  const t = localStorage.getItem("token");
  if (t) return t;
  if (!DEV) return null;
  if (!_refreshing) _refreshing = devLogin().finally(() => (_refreshing = null));
  await _refreshing;
  return localStorage.getItem("token");
}
async function fetchWithAuth(url, init = {}, retryOn401 = true) {
  await ensureToken();
  const res = await fetch(url, init);
  if (res.status === 401 && DEV && retryOn401) {
    await ensureToken();
    return fetch(url, init);
  }
  return res;
}

/** --- Auth flows --- */
export async function devLogin() {
  const res = await fetch(`${API_URL}/auth/dev-login`, { method: "POST" });
  if (!res.ok) throw new Error((await res.text()) || `Dev login failed (${res.status})`);
  const { access_token } = await res.json();
  if (!access_token) throw new Error("No access_token");
  localStorage.setItem("token", access_token);
  const payload = parseJwt(access_token);
  localStorage.setItem("role", payload.role || "admin");
  return { token: access_token, role: payload.role || "admin" };
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error((await res.text()) || `Login failed (${res.status})`);
  const { access_token } = await res.json();
  if (!access_token) throw new Error("No access_token");
  localStorage.setItem("token", access_token);
  const payload = parseJwt(access_token);
  localStorage.setItem("role", payload.role || "user");
  return { token: access_token, role: payload.role || "user" };
}

/** --- Dev tools --- */
export async function devReset() {
  const res = await fetchWithAuth(`${API_URL}/dev/reset`, {
    method: "POST", headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error(`Reset failed (${res.status})`);
}
export async function devSeed() {
  const res = await fetchWithAuth(`${API_URL}/dev/seed`, {
    method: "POST", headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error(`Seed failed (${res.status})`);
}

/** --- Generic helpers (axios-like) --- */
export async function get(path) {
  const res = await fetchWithAuth(_url(path), { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error(`GET ${path} failed (${res.status})`);
  return res.json();
}
export async function post(path, body) {
  const res = await fetchWithAuth(_url(path), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body !== undefined ? JSON.stringify(body) : null,
  });
  if (!res.ok) throw new Error((await res.text().catch(()=> "")) || `POST ${path} failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}
export async function put(path, body) {
  const res = await fetchWithAuth(_url(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed (${res.status})`);
  return res.json();
}
export async function del(path) {
  const res = await fetchWithAuth(_url(path), { method: "DELETE", headers: { ...authHeaders() } });
  if (!res.ok) throw new Error(`DELETE ${path} failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}

/** --- Normalizers --- */
export function toList(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.items)) return json.items;
  if (json && Array.isArray(json.results)) return json.results;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
}

/** --- Specific helpers used elsewhere --- */
export async function getSuggestionsForVisit(visitId) {
  if (!visitId) throw new Error("visitId is required");
  const res = await fetchWithAuth(`${API_URL}/visits/suggestions?visit_id=${encodeURIComponent(visitId)}`, {
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error((await res.text().catch(()=> "")) || `Suggestions failed (${res.status})`);
  return res.json();
}

/** Default export for existing imports */
export default {
  authHeaders,
  devLogin,
  login,
  devReset,
  devSeed,
  get, post, put, del,
  getSuggestionsForVisit,
  toList,
  API_URL,
};

export { API_URL };
