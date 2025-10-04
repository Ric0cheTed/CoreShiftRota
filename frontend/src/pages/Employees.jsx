import React from "react";
import useApi from "../hooks/useApi.js";

function pick(x, ...alts) {
  for (const v of [x, ...alts]) if (v !== undefined && v !== null && v !== "") return v;
  return "-";
}
function pickId(e) { return e.id ?? e.employee_id ?? e.username ?? Math.random().toString(36).slice(2); }

export default function Employees() {
  const { data, loading, error, reload } = useApi("/employees", { list: true });
  const employees = Array.isArray(data) ? data : [];

  if (loading) return <div className="p-4">Loading employees…</div>;
  if (error)   return (
    <div className="p-4">
      <div className="text-red-600 mb-2">{error}</div>
      <button className="px-3 py-1 border rounded" onClick={reload}>Retry</button>
    </div>
  );
  if (!employees.length) return <div className="p-4">No employees found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">Employees</h1>
      <table className="min-w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2 border">Name</th>
            <th className="text-left p-2 border">Role</th>
            <th className="text-left p-2 border">Phone</th>
            <th className="text-left p-2 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={pickId(e)}>
              <td className="p-2 border">{pick(e.name, e.full_name, e.username)}</td>
              <td className="p-2 border">{pick(e.role, "carer")}</td>
              <td className="p-2 border">{pick(e.phone, e.mobile)}</td>
              <td className="p-2 border">{pick(e.email)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
