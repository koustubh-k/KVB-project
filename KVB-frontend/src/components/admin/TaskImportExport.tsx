import React, { useState } from "react";
import { Upload, FileText, Download } from "lucide-react";
import axios from "axios";

interface TaskImportExportProps {
  onSuccess: () => void;
}

const TaskImportExport: React.FC<TaskImportExportProps> = ({ onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError(null);

    try {
      await axios.post("/api/admin/bulk-import/tasks", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error uploading tasks");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);

    try {
      const response = await axios.get("/api/admin/export/tasks", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error downloading tasks");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Import Button */}
      <div className="relative">
        <input
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          id="task-import"
          onChange={handleFileUpload}
        />
        <label
          htmlFor="task-import"
          className={`btn btn-secondary flex items-center ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Importing..." : "Import Tasks"}
        </label>
      </div>

      {/* Export Button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`btn btn-secondary flex items-center ${
          downloading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Download className="w-4 h-4 mr-2" />
        {downloading ? "Exporting..." : "Export Tasks"}
      </button>

      {/* Sample Template Button */}
      <button
        onClick={() => {
          // Download sample template
          const link = document.createElement("a");
          link.href = "/samples/task-template.xlsx";
          link.download = "task-template.xlsx";
          document.body.appendChild(link);
          link.click();
          link.remove();
        }}
        className="btn btn-outline-secondary flex items-center"
      >
        <FileText className="w-4 h-4 mr-2" />
        Download Template
      </button>

      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default TaskImportExport;
