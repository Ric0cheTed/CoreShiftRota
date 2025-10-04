import React, { useState } from "react";
import RotaVisitCard from "./RotaVisitCard";
import CoverageDrawer from "./components/CoverageDrawer";
import { getSuggestionsForVisit } from "../../services/api";

const RotaDayView = ({
  visits,
  editMode,
  clients,
  employees,
  suggestions,
  loadingSuggestions,
  saveStatus,
  savingVisitId,
  handleChange,
  handleSave,
  setSuggestions,
  setLoadingSuggestions,
}) => {
  const [coverageVisitId, setCoverageVisitId] = useState(null);
  const selectedVisit = visits.find((v) => v.id === coverageVisitId);
  const handleRequestCover = (visitId) => setCoverageVisitId(visitId);

  const handleRefreshSuggestions = async (visitId) => {
    setLoadingSuggestions((prev) => ({ ...prev, [visitId]: true }));
    try {
      const freshSuggestions = await getSuggestionsForVisit(visitId);
      setSuggestions((prev) => ({ ...prev, [visitId]: freshSuggestions }));
    } catch (err) {
      console.error("Failed to refresh suggestions:", err);
    } finally {
      setLoadingSuggestions((prev) => ({ ...prev, [visitId]: false }));
    }
  };

  return (
    <div className="grid gap-4 p-4">
      {visits.map((visit) => (
        <RotaVisitCard
          key={visit.id}
          visit={visit}
          editMode={editMode}
          clients={clients}
          employees={employees}
          suggestions={suggestions[visit.id] || []}
          loadingSuggestions={loadingSuggestions[visit.id]}
          saveStatus={saveStatus[visit.id]}
          savingVisitId={savingVisitId}
          handleChange={handleChange}
          handleSave={handleSave}
          handleRefreshSuggestions={handleRefreshSuggestions}
          handleRequestCover={handleRequestCover}
        />
      ))}

      {coverageVisitId && (
        <CoverageDrawer
          visit={selectedVisit}
		  employees={employees}
          onClose={() => setCoverageVisitId(null)}
        />
      )}
    </div>
  );
};

export default RotaDayView;
