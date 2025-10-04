import axios from "axios";

// Reuse existing axios base if present
let http = axios.create({ baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000" });
try {
  // optional dynamic import of existing http wrapper
  // @ts-ignore
  const mod = await import("../../services/http");
  if (mod?.default) http = mod.default;
} catch {}

import type { Suggestion, VisitInput } from "./types";

export async function fetchRotaSuggestions(visit: VisitInput): Promise<Suggestion[]> {
  const { data } = await http.post("/rota/suggest", visit);
  return data as Suggestion[];
}

export async function assignVisit(visit_id: number, employee_id: number) {
  const { data } = await http.post("/rota/assign", null, { params: { visit_id, employee_id } });
  return data;
}