// src/pages/Audit.jsx
import React, { useEffect, useState } from "react";
import api from "/src/services/api.js";

// normalize common shapes: [], {items}, {results}, {data}
function toList(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.items)) return json.items;
  if (json && Array.isArray(json.results)) return json.results;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
}

export default function Audit() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        let data;
        try {
          data = await api.get("/audit/alerts");
        } catch {
          data = await api.get("/audit");
        }
        if (!alive) return;
        setRows(toList(data));
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setErr("Failed to load audit alerts");
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <div className="p-4">Loading audit…</div>;
  if (err) return <div className="p-4 text-red-600">{err}</div>;
  if (!rows.length) return <div className="p-4">No audit alerts.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">Audit Alerts</h1>
      <table className="min-w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2 border">Type</th>
            <th className="text-left p-2 border">Message</th>
            <th className="text-left p-2 border">Visit / Entity</th>
            <th className="text-left p-2 border">When</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id ?? r.uuid ?? i}>
              <td className="p-2 border">{r.type ?? r.level ?? "info"}</td>
              <td className="p-2 border">{r.message ?? r.msg ?? r.description ?? "-"}</td>
              <td className="p-2 border">{r.visit_id ?? r.entity_id ?? r.subject ?? "-"}</td>
              <td className="p-2 border">
                {r.timestamp
                  ? new Date(r.timestamp).toLocaleString()
                  : r.time ?? r.created_at ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
