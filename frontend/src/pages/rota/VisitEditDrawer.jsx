import React, { useState, useEffect } from "react";
import axios from "@/services/api";

const VisitDrawer = ({ visit, employees, clients, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    employee_id: visit.employee_id || "",
    client_id: visit.client_id || "",
    start_time: visit.start_time || "",
    end_time: visit.end_time || "",
    notes: visit.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`/visits/${visit.id}`, formData);
      onSave?.(response.data);
    } catch (err) {
      console.error("❌ Failed to update visit:", err);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-4 z-50 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Edit Visit #{visit.id}</h2>
        <button onClick={onClose} className="text-gray-500">✕</button>
      </div>

      <label className="block text-sm font-medium">Client</label>
      <select
        name="client_id"
        value={formData.client_id}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select Client</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name || `Client #${c.id}`}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium">Carer</label>
      <select
        name="employee_id"
        value={formData.employee_id}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select Carer</option>
        {employees.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name || `Employee #${e.id}`}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium">Start Time</label>
      <input
        type="time"
        name="start_time"
        value={formData.start_time}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block text-sm font-medium">End Time</label>
      <input
        type="time"
        name="end_time"
        value={formData.end_time}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block text-sm font-medium">Notes</label>
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default VisitDrawer;
