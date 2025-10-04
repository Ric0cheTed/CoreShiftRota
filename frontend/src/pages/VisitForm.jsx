import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function VisitForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    date: "",
    start_time: "",
    end_time: "",
    client_id: "",
    employee_id: "",
    notes: "",
  });

  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/clients").then(res => setClients(res.data));
    api.get("/employees").then(res => setEmployees(res.data));

    if (isEdit) {
      api.get(`/visits/${id}`).then(res => {
        const v = res.data;
        setForm({
          date: v.date,
          start_time: v.start_time,
          end_time: v.end_time,
          client_id: v.client?.id || "",
          employee_id: v.employee?.id || "",
          notes: v.notes || "",
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSuggest = async () => {
    const { date, start_time, end_time } = form;
    if (!date || !start_time || !end_time) {
      setError("Select date and time first.");
      return;
    }

    try {
      const res = await api.post("/visits/suggestions", { date, start_time, end_time });
      setSuggestions(res.data);
    } catch (err) {
      console.error("❌ Suggestion failed:", err);
      setError("Could not fetch suggestions.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.start_time >= form.end_time) {
      setError("End time must be after start time.");
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/visits/${id}`, form);
      } else {
        await api.post("/visits", form);
      }
      navigate("/visits");
    } catch (err) {
      console.error("❌ Failed to submit visit:", err);
      setError("Error saving visit. Check the console.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">{isEdit ? "Edit Visit" : "Create New Visit"}</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium">Visit Date</span>
          <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full p-2 border rounded" />
        </label>

        <div className="flex gap-2">
          <label className="flex-1">
            <span className="block text-sm font-medium">Start Time</span>
            <input type="time" name="start_time" value={form.start_time} onChange={handleChange} required className="w-full p-2 border rounded" />
          </label>
          <label className="flex-1">
            <span className="block text-sm font-medium">End Time</span>
            <input type="time" name="end_time" value={form.end_time} onChange={handleChange} required className="w-full p-2 border rounded" />
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-medium">Client</span>
          <select name="client_id" value={form.client_id} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.full_name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Assigned Carer</span>
          <select name="employee_id" value={form.employee_id} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select carer (optional)</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.full_name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Notes</span>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes..." className="w-full p-2 border rounded" />
        </label>

        <div className="flex justify-between gap-4">
          <button type="button" onClick={handleSuggest} className="bg-yellow-600 text-white px-4 py-2 rounded">
            Suggest Carers
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {isEdit ? "Update Visit" : "Create Visit"}
          </button>
        </div>
      </form>

      {suggestions.length > 0 && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Suggested Carers</h2>
          {suggestions.map((s) => (
            <p key={s.id}>
              <button
                onClick={() => setForm({ ...form, employee_id: s.id })}
                className="text-blue-700 underline"
              >
                {s.name} ({s.visit_count} visits)
              </button>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default VisitForm;
