import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api"; // instead of axios


const VisitDetail = () => {
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const res = await api.get(`/visits/${id}`);
        setVisit(res.data);
      } catch (err) {
        setError("Could not fetch visit details.");
        console.error(err);
      }
    };
    fetchVisit();
  }, [id]);

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!visit) return <div className="p-4">Loading visit details...</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Visit Detail</h2>
      <div className="bg-white shadow rounded p-4 space-y-2">
        <div><strong>Date:</strong> {visit.date}</div>
        <div><strong>Time:</strong> {visit.start_time} – {visit.end_time}</div>
        <div><strong>Carer:</strong> {visit.employee?.full_name || "Unassigned"}</div>
        <div><strong>Client:</strong> {visit.client?.full_name || "Unknown"}</div>
        <div><strong>Notes:</strong> {visit.notes || "None"}</div>
      </div>

      <div className="mt-4">
        <Link
          to="/visits"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ← Back to Visits
        </Link>
      </div>
    </div>
  );
};

export default VisitDetail;
