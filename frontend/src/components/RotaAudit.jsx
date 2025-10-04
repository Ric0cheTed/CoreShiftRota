import { useEffect, useState } from "react";
import axios from "../services/api";

function RotaAudit() {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch audit data when the component mounts
  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const response = await axios.get("/audit/rota");
        setAuditData(response.data.audits);
      } catch (err) {
        setError("Failed to fetch audit data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditData();
  }, []);

  if (loading) return <div>Loading audit data...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Rota Audit Alerts</h2>
      <div className="mt-4">
        {auditData.length === 0 ? (
          <p>No issues detected in the rota.</p>
        ) : (
          <ul>
            {auditData.map((audit) => (
              <li
                key={audit.visit_id}
                className={`p-4 mb-2 border rounded ${
                  audit.type === "UnassignedVisit"
                    ? "bg-yellow-200"
                    : audit.type === "MissingNotes"
                    ? "bg-red-200"
                    : "bg-blue-200"
                }`}
              >
                <strong>{audit.type}</strong>
                <p>Client: {audit.client}</p>
                <p>Date: {audit.date}</p>
                <p>Details: {audit.details}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RotaAudit;
