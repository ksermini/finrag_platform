import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const APILogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/admin/logs/api`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setLogs)
      .catch(() => {
        setError("Failed to load API logs.");
        setLogs([]);
      });
  }, []);

  return (
    <div className="text-xs space-y-2">
      <div className="font-bold">[ API Logs ]</div>
      {error && <div className="text-red-400">{error}</div>}
      <ul className="space-y-1 max-h-64 overflow-y-auto border border-gray-700 p-2">
        {logs.map((log, i) => (
          <li key={i} className="text-gray-400 border-b border-gray-800 pb-1">
            {log}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default APILogs;
