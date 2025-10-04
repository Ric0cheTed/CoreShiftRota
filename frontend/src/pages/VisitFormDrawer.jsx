import React, { useState } from "react";
import axios from "../services/api";

const VisitFormDrawer = ({ open, onClose, clients, employees, onVisitCreated }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [form, setForm] = useState({
    date: "",
    start_time: "",
    end_time: "",
    notes: "",
    client_id: "",
    employee_id: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        client_id: parseInt(form.client_id),
        employee_id: form.employee_id ? parseInt(form.employee_id) : null,
        start_time: `${form.date}T${form.start_time}`,
        end_time: `${form.date}T${form.end_time}`,
        notes: form.notes,
      };

      console.log("🚀 Visit Payload:", payload);

      const res = await axios.post("/visits/", payload);
      const createdVisit = res.data;

      // Only call this if it's explicitly passed (used in Audit tab, not in Rota)
      if (typeof onVisitCreated === "function") {
        onVisitCreated(createdVisit);
      }

      // Fetch suggestions for this visit
      try {
        const suggestionRes = await axios.get(`/visits/suggestions?visit_id=${createdVisit.id}`);
        setSuggestions(suggestionRes.data?.suggestions || []);
      } catch (suggErr) {
        console.warn("⚠️ Suggestion fetch failed", suggErr);
      }

      onClose(); // Close drawer after creation
    } catch (err) {
      console.error("❌ Visit creation failed:", err);
      alert("Failed to create visit");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-lg border-l p-4 z-[999] overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Create Visit</h2>

      {suggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-4">
          <h3 className="text-sm font-semibold mb-1">Top Suggestions:</h3>
          <ul className="text-sm list-disc ml-4 space-y-1">
            {suggestions.slice(0, 3).map((s, i) => (
              <li key={i}>
                {s.employee_name || `Employee #${s.employee_id}`} — {s.start_time} to {s.end_time}
                {s.score !== undefined && ` (Match: ${s.score}%)`}
                {s.reasons?.length ? ` – ${s.reasons.join(", ")}` : ""}
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              const top = suggestions[0];
              if (top?.employee_id) {
                setForm((prev) => ({ ...prev, employee_id: top.employee_id }));
              }
            }}
            className="mt-2 text-sm text-blue-700 underline"
          >
            Auto-assign top match
          </button>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm">Client <span className="text-red-500">*</span></label>
        <select
          value={form.client_id}
          onChange={(e) => handleChange("client_id", e.target.value)}
          className="w-full border p-2"
        >
          <option value="">Select client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.full_name}</option>
          ))}
        </select>

        <label className="block text-sm">Employee</label>
        <select
          value={form.employee_id}
          onChange={(e) => handleChange("employee_id", e.target.value)}
          className="w-full border p-2"
        >
          <option value="">Select employee</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>{e.full_name}</option>
          ))}
        </select>

        <label className="block text-sm">Date <span className="text-red-500">*</span></label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="w-full border p-2"
        />

        <label className="block text-sm">Start Time <span className="text-red-500">*</span></label>
        <input
          type="time"
          value={form.start_time}
          onChange={(e) => handleChange("start_time", e.target.value)}
          className="w-full border p-2"
        />

        <label className="block text-sm">End Time <span className="text-red-500">*</span></label>
        <input
          type="time"
          value={form.end_time}
          onChange={(e) => handleChange("end_time", e.target.value)}
          className="w-full border p-2"
        />

        <label className="block text-sm">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="w-full border p-2"
          rows={3}
        />

        <div className="flex justify-between pt-4">
          <button onClick={onClose} className="text-gray-600">Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={!(form.client_id && form.date && form.start_time && form.end_time)}
            title={!(form.client_id && form.date && form.start_time && form.end_time)
              ? "Fill required fields first"
              : ""}
          >
            Create Visit
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitFormDrawer;
