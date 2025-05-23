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
    <div className="text-xs space-y-4 text-cyan-100">
      <h2 className="text-sm font-bold glow-text">[ Audit Viewer ]</h2>
      {error && <div className="text-red-400">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
        {logs.map((log, i) => (
          <div
            key={i}
            className="p-3 bg-[#0f1a1a] border border-cyan-400 rounded-md shadow shadow-cyan-500/20 augmented-panel"
            augmented-ui="tl-clip br-clip border"
          >
            <div className="mb-1 text-green-300 glow-text font-semibold">
              #{i + 1} — {log.timestamp?.split("T")[0]}
            </div>
            <div><span className="text-gray-400">User:</span> {log.user_id}</div>
            <div><span className="text-gray-400">Model:</span> {log.model}</div>
            <div><span className="text-gray-400">Latency:</span> {log.latency_ms} ms</div>
            <div><span className="text-gray-400">Tokens:</span> {log.tokens_input} in / {log.tokens_output} out</div>
            <div><span className="text-gray-400">Source:</span> {log.source_type}</div>
            <div><span className="text-gray-400">Cached:</span> {String(log.cached)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditViewer;
