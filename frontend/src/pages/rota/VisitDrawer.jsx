import React, { useEffect, useState } from "react";

const formatTime = (time) => time?.slice(0, 5) || "";

const VisitDrawer = ({ visit, employees, clients, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...visit });

  useEffect(() => {
    setFormData({ ...visit });
  }, [visit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave?.(formData);
  };

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-4 border-l z-50 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Edit Visit</h2>
        <button onClick={onClose} className="text-blue-600 text-sm">Close</button>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Client</label>
        <select
          name="client_id"
          value={formData.client_id}
          onChange={handleChange}
          className="w-full border px-2 py-1 text-sm rounded"
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name || c.name || `Client #${c.id}`}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Carer</label>
        <select
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
          className="w-full border px-2 py-1 text-sm rounded"
        >
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.full_name || e.name || `Employee #${e.id}`}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Start Time</label>
        <input
          type="time"
          name="start_time"
          value={formatTime(formData.start_time)}
          onChange={handleChange}
          className="w-full border px-2 py-1 text-sm rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">End Time</label>
        <input
          type="time"
          name="end_time"
          value={formatTime(formData.end_time)}
          onChange={handleChange}
          className="w-full border px-2 py-1 text-sm rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          rows={3}
          className="w-full border px-2 py-1 text-sm rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        Save
      </button>
    </div>
  );
};

export default VisitDrawer;
