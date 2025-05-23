import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ModelStatus = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/admin/system-metrics`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch model status");
        return res.json();
      })
      .then(setStatus)
      .catch(() => {
        setError("Failed to load model status.");
        setStatus(null);
      });
  }, []);

  return (
    <div className="text-xs space-y-2">
      <div className="font-bold">[ Model Status ]</div>
      {error && <div className="text-red-400">{error}</div>}
      {status ? (
        <pre className="bg-black border border-gray-600 p-2 text-green-400">
          {JSON.stringify(status, null, 2)}
        </pre>
      ) : !error ? (
        <div className="text-gray-500">Loading system metrics...</div>
      ) : null}
    </div>
  );
};

export default ModelStatus;
