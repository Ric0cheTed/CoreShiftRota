
import { useEffect, useState } from "react";
import axios from "../services/api";

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (err) {
    console.error("Manual JWT decode failed:", err);
    return null;
  }
};

function MyShifts() {
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = decodeToken(token);
    if (decoded) setUser(decoded);
  }, []);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await axios.get("/visits");
        setVisits(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch visits:", err.response?.data || err.message);
        setError("Could not load visits.");
      }
    };

    if (user) fetchVisits();
  }, [user]);

  const filteredVisits = visits.filter(
    (v) => v.employee?.username === user?.sub
  );

  if (!user) return <div className="p-6">Loading your shifts...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Shifts</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full border bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Client</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Start</th>
            <th className="border px-4 py-2">End</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisits.map((v) => (
            <tr key={v.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{v.client?.full_name}</td>
              <td className="border px-4 py-2">{v.date}</td>
              <td className="border px-4 py-2">{v.start_time}</td>
              <td className="border px-4 py-2">{v.end_time}</td>
              <td className="border px-4 py-2">{v.status || "scheduled"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyShifts;
