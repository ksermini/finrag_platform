import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const GroupModal = ({ group, onClose }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/groups/${group.id}/documents`);
      setFiles(res.data);
    } catch {
      console.error("Failed to fetch documents.");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      await axios.post(`${API_BASE}/groups/${group.id}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchDocuments();
    } catch {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [group]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 text-white rounded-lg p-6 w-full max-w-2xl space-y-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Manage: {group.name}</h2>
          <button onClick={onClose} className="text-sm text-zinc-400 hover:text-white">Close</button>
        </div>

        <label className="block text-sm font-medium text-zinc-300 mb-1">Upload PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          disabled={uploading}
          className="text-sm bg-zinc-800 rounded p-2 file:text-white file:bg-indigo-600 file:px-3 file:py-1 file:rounded hover:file:bg-indigo-500"
        />

        <div className="text-sm text-zinc-400 mt-4">Documents</div>
        <ul className="space-y-2 max-h-64 overflow-auto">
          {files.map((doc) => (
            <li key={doc.id} className="flex justify-between items-center bg-zinc-800 p-3 rounded">
              <span>{doc.title}</span>
              <span className="text-xs text-[var(--theme-muted)]">{new Date(doc.created_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupModal;
