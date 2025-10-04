// src/hooks/useApi.js
import { useEffect, useState, useCallback } from "react";
import api from "/src/services/api.js";

/**
 * Fetch any endpoint and get { data, loading, error, reload }.
 * - If options.list === true, data defaults to [] and normalizes arrays
 * - Auto-reloads when the Dev Banner dispatches: new CustomEvent("data:refresh", { detail: { scope: "all" } })
 */
export default function useApi(path, { list = false, deps = [] } = {}) {
  const [data, setData] = useState(list ? [] : null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const json = await api.get(path);
      setData(list ? api.toList(json) : json);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Request failed");
      setData(list ? [] : null);
    } finally {
      setLoading(false);
    }
  }, [path, list]);

  // initial load + when deps change
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps.length ? deps : [load]);

  // listen for global refresh events from the Dev Banner
  useEffect(() => {
    const onRefresh = (evt) => {
      const detail = evt?.detail || {};
      if (!detail.scope || detail.scope === "all" || detail.path === path) {
        load();
      }
    };
    window.addEventListener("data:refresh", onRefresh);
    return () => window.removeEventListener("data:refresh", onRefresh);
  }, [path, load]);

  return { data, loading, error, reload: load };
}

// Convenience for list endpoints
export function useList(path, deps = []) {
  return useApi(path, { list: true, deps });
}
