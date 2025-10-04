import React, { useEffect, useState } from "react";
import api, { getSuggestionsForVisit } from "../../../services/api";

const CoverageDrawer = ({ visit, onClose }) => {
  console.log("Drawer visit payload →", visit);

  const [isEligible, setIsEligible] = useState(false);
  const [checkedEligibility, setCheckedEligibility] = useState(false);

  useEffect(() => {
    if (!visit?.id) return;
    setCheckedEligibility(false);
    api
      .get(`/coverage/eligibility?visit_id=${visit.id}`)
      .then((res) => setIsEligible(res.data.eligible))
      .catch((err) => {
        console.error("Eligibility check failed:", err);
        setIsEligible(false);
      })
      .finally(() => setCheckedEligibility(true));
  }, [visit?.id]);

  if (!visit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white p-6 shadow-lg overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Request Cover</h2>
          <button onClick={onClose} className="text-red-600 font-bold">X</button>
        </div>

        <div className="space-y-2">
          <div><strong>Date:</strong> {visit.date || "?"}</div>
          <div><strong>Time:</strong> {visit.start_time || "?"} - {visit.end_time || "?"}</div>
          <div><strong>Client:</strong> {visit.client_name || "Unknown"}</div>
        </div>

        <div className="mt-6 text-gray-700 text-sm">
          ✅ Coverage request has been sent to eligible carers.
          <br />
          You’ll be notified when someone offers to cover this shift.
        </div>

        {checkedEligibility && isEligible && (
          <button className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            I’ll Cover This Shift
          </button>
        )}
      </div>
    </div>
  );
};

export default CoverageDrawer;
