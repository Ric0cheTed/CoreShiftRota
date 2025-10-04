import React from "react";

const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex justify-end mb-4 space-x-2">
      <button
        onClick={() => setViewMode("grid")}
        className={`px-4 py-2 rounded ${viewMode === "grid" ? "bg-green-600 text-white" : "bg-gray-200 text-black"}`}
      >
        Grid View
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`px-4 py-2 rounded ${viewMode === "list" ? "bg-green-600 text-white" : "bg-gray-200 text-black"}`}
      >
        List View
      </button>
    </div>
  );
};

export default ViewToggle;
