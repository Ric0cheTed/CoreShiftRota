
import axios from "../services/api";

function ExportRotaButton() {
  const handleExport = async () => {
    try {
      const response = await axios.get("/export/rota", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/zip" });

      // Extract filename from Content-Disposition header
      const disposition = response.headers["content-disposition"];
      const match = disposition && disposition.match(/filename="?(.+)"?/);
      const filename = match ? match[1] : "coreshift_export.zip";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Failed to export rota:", error);
      alert("Export failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Export Rota (ZIP)
    </button>
  );
}

export default ExportRotaButton;
