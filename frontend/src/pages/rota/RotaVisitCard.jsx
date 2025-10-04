
import React from "react";

const formatTime = (value) => {
  if (!value) return "";
  if (typeof value === "string" && value.includes(":")) {
    return value.split(":").slice(0, 2).join(":");
  }
  return value;
};

const RotaVisitCard = ({
  visit,
  clients = [],
  employees = [],
  editMode,
  handleRequestCover,
  savingVisitId,
  saveStatus,
  loadingSuggestions,
  suggestions,
  handleChange,
  handleSave,
  handleRefreshSuggestions,
}) => {
  if (!clients || !employees) return null;

  return (
    <div className="p-3 border rounded shadow-sm bg-white space-y-1">
      <div className="text-xs text-gray-500">
        #{visit.id} | {visit.client_name || `Client #${visit.client_id}`} | {visit.employee_name || `Carer #${visit.employee_id}`}
      </div>

      {editMode ? (
        <>
          <div className="space-y-1">
            <label className="text-sm">Date</label>
            <input
              type="date"
              value={visit.date}
              onChange={(e) => handleChange(visit.id, "date", e.target.value)}
              className="border w-full px-2 py-1 text-sm"
            />

            <label className="text-sm">Start & End Time</label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={formatTime(visit.start_time)}
                onChange={(e) => handleChange(visit.id, "start_time", e.target.value)}
                className="border px-2 py-1 text-sm"
              />
              <span>to</span>
              <input
                type="time"
                value={formatTime(visit.end_time)}
                onChange={(e) => handleChange(visit.id, "end_time", e.target.value)}
                className="border px-2 py-1 text-sm"
              />
            </div>

            <label className="text-sm mt-2">Client</label>
            <select
              value={visit.client_id}
              onChange={(e) => handleChange(visit.id, "client_id", e.target.value)}
              className="border w-full px-2 py-1 text-sm"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.full_name}</option>
              ))}
            </select>

            <label className="text-sm">Employee</label>
            <select
              value={visit.employee_id || ""}
              onChange={(e) => handleChange(visit.id, "employee_id", e.target.value)}
              className="border w-full px-2 py-1 text-sm"
            >
              <option value="">Unassigned</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.full_name}</option>
              ))}
            </select>

            <label className="text-sm mt-2">Notes</label>
            <textarea
              value={visit.notes || ""}
              onChange={(e) => handleChange(visit.id, "notes", e.target.value)}
              placeholder="Optional notes"
              className="border w-full p-2 text-sm"
            />
          </div>

          <button
			onClick={() => handleRequestCover(visit.id)}
			className="mt-2 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
		  >
			Request Cover
		  </button>

          <button
            onClick={() => handleSave(visit)}
            disabled={savingVisitId === visit.id}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {saveStatus === "saving" ? "Saving..." : "Save"}
          </button>

          {saveStatus === "success" && (
            <span className="ml-2 text-green-600" title="Saved successfully">✅</span>
          )}
          {saveStatus === "error" && (
            <span className="ml-2 text-red-600" title="Failed to save">❌</span>
          )}

          <div className="flex justify-between items-center mt-2">
            <strong>Suggestions:</strong>
            <button
              onClick={() => handleRefreshSuggestions?.(visit.id)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              🔄 Refresh
            </button>
          </div>

          {loadingSuggestions ? (
            <div className="text-xs text-gray-400 mt-1">Loading...</div>
          ) : (
            <ul className="ml-4 list-disc text-xs text-gray-600 space-y-1">
              {suggestions?.length > 0 ? (
                suggestions.map((s, idx) => (
                  <li key={idx}>
                    <strong>{s.employee_name || `Employee #${s.employee_id}`}</strong> — {s.reasons?.join(", ")} — {s.start_time} to {s.end_time}
                  </li>
                ))
              ) : (
                <li>No suggestions</li>
              )}
            </ul>
          )}
        </>
      ) : (
        <div>
          {visit.date} — {visit.start_time} to {visit.end_time}
          <br />
          {visit.notes && <div className="text-xs mt-1 text-gray-700">Notes: {visit.notes}</div>}
        </div>
      )}
    </div>
  );
};

export default RotaVisitCard;
