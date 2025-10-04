import { useState, useCallback } from "react";
import { fetchRotaSuggestions } from "./api";
import type { VisitInput, Suggestion } from "./types";

export function useRotaSuggestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Suggestion[] | null>(null);

  const run = useCallback(async (visit: VisitInput) => {
    setLoading(true); setError(null);
    try {
      const res = await fetchRotaSuggestions(visit);
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, run };
}