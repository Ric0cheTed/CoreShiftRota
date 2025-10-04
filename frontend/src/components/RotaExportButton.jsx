import { useState } from "react";
import axios from "../services/api";

function RotaExportButton() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [downloading, setDownloading] = useState(false);

  const downloadExport = async () => {
    if (!start || !end) return alert("Please select a date range.");
    setDownloading(true);
    try {
      const response = await axios.get(`/export/rota`, {
        params: { start, end },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rota_export_${start}_to_${end}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to download rota export.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white border rounded p-4 shadow text-sm">
      <div className="flex items-center gap-2 mb-2">
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border p-1"
        />
        <span>to</span>
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border p-1"
        />
      </div>
      <button
        onClick={downloadExport}
        disabled={downloading}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {downloading ? "Downloading..." : "Download Rota Export"}
      </button>
    </div>
  );
}

export default RotaExportButton;
