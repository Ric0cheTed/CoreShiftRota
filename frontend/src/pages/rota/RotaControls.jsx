import React from "react";
import RotaExportButton from "../../components/RotaExportButton";

const RotaControls = ({ editMode, setEditMode, viewMode, setViewMode }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="space-x-2">
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
        >
          {editMode ? "Disable Editing" : "Enable Editing"}
        </button>

        <button
          onClick={() => setViewMode(viewMode === "day" ? "week" : "day")}
          className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
        >
          {viewMode === "day" ? "Switch to Week View" : "Switch to Day View"}
        </button>
      </div>

      <RotaExportButton />
    </div>
  );
};

export default RotaControls;
