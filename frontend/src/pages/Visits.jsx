import React from "react";
import useApi from "../hooks/useApi.js";

function pick(x, ...alts) {
  for (const v of [x, ...alts]) if (v !== undefined && v !== null && v !== "") return v;
  return "-";
}
function fmtDate(d) {
  if (!d) return "-";
  try { return new Date(d).toLocaleDateString(); } catch { return d; }
}
function pickId(v) { return v.id ?? v.visit_id ?? v.uuid ?? Math.random().toString(36).slice(2); }

export default function Visits() {
  const { data, loading, error, reload } = useApi("/visits", { list: true });
  const visits = Array.isArray(data) ? data : [];

  if (loading) return <div className="p-4">Loading visits…</div>;
  if (error)   return (
    <div className="p-4">
      <div className="text-red-600 mb-2">{error}</div>
      <button className="px-3 py-1 border rounded" onClick={reload}>Retry</button>
    </div>
  );
  if (!visits.length) return <div className="p-4">No visits found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">Visits</h1>
      <table className="min-w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2 border">Date</th>
            <th className="text-left p-2 border">Start</th>
            <th className="text-left p-2 border">End</th>
            <th className="text-left p-2 border">Client</th>
            <th className="text-left p-2 border">Carer</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((v) => (
            <tr key={pickId(v)}>
              <td className="p-2 border">{fmtDate(pick(v.date, v.visit_date))}</td>
              <td className="p-2 border">{pick(v.start_time, v.start)}</td>
              <td className="p-2 border">{pick(v.end_time, v.end)}</td>
              <td className="p-2 border">{pick(v.client_name, v.client, v.client_full_name)}</td>
              <td className="p-2 border">{pick(v.employee_name, v.carer, v.employee_full_name, v.staff_name)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
