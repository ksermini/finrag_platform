import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AuditViewer = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/admin/audit/logs`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setLogs)
      .catch(() => {
        setError("Failed to load audit logs.");
        setLogs([]);
      });
  }, []);

  return (
    <div className="text-xs space-y-2">
      <div className="font-bold">[ Audit Viewer ]</div>
      {error && <div className="text-red-400">{error}</div>}
      <ul className="space-y-1 max-h-64 overflow-y-auto border border-gray-700 p-2">
        {logs.map((log, i) => (
          <li key={i} className="border-b border-gray-800 pb-1 text-gray-300">
            {typeof log === "string" ? log : JSON.stringify(log, null, 2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditViewer;
