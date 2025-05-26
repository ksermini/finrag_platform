import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const GroupDocumentsModal = ({ group, onClose }) => {
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = () => {
    axios
      .get(`${API_BASE}/groups/${group.id}/documents`)
      .then((res) => setDocs(res.data))
      .catch(() => setDocs([]));
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      await axios.post(`${API_BASE}/groups/${group.id}/documents`, formData);
      fetchDocuments();
      setFile(null);
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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-zinc-900 p-6 rounded shadow-lg text-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Documents for <span className="text-indigo-400">{group.name}</span>
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-red-400">
            ✕
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="bg-zinc-800 rounded p-2 text-xs"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <div className="grid gap-3">
          {docs.map((doc) => (
            <div key={doc.id} className="p-3 bg-zinc-800 rounded border border-zinc-700">
              <div className="font-medium">{doc.title}</div>
              <div className="text-xs text-zinc-400">
                Embedded: {doc.embedded ? "Yes" : "No"} — {new Date(doc.created_at).toLocaleString()}
              </div>
            </div>
          ))}
          {!docs.length && (
            <div className="text-zinc-400 text-xs italic">No documents uploaded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDocumentsModal;
