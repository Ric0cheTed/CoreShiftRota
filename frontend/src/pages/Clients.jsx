import React from "react";
import useApi from "../hooks/useApi.js";

function pick(x, ...alts) {
  for (const v of [x, ...alts]) if (v !== undefined && v !== null && v !== "") return v;
  return "-";
}
function pickId(c) { return c.id ?? c.client_id ?? c.uuid ?? Math.random().toString(36).slice(2); }

export default function Clients() {
  const { data, loading, error, reload } = useApi("/clients", { list: true });
  const clients = Array.isArray(data) ? data : [];

  if (loading) return <div className="p-4">Loading clients…</div>;
  if (error)   return (
    <div className="p-4">
      <div className="text-red-600 mb-2">{error}</div>
      <button className="px-3 py-1 border rounded" onClick={reload}>Retry</button>
    </div>
  );
  if (!clients.length) return <div className="p-4">No clients found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">Clients</h1>
      <table className="min-w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2 border">Name</th>
            <th className="text-left p-2 border">Phone</th>
            <th className="text-left p-2 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={pickId(c)}>
              <td className="p-2 border">{pick(c.name, c.full_name, c.client_name, c.display_name)}</td>
              <td className="p-2 border">{pick(c.phone, c.mobile, c.contact_phone)}</td>
              <td className="p-2 border">{pick(c.email, c.contact_email)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
