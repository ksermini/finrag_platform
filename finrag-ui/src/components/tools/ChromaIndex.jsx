import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ChromaIndex = () => {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/admin/chroma/index`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch index info");
        return res.json();
      })
      .then(setInfo)
      .catch(() => {
        setError("Failed to load Chroma index metadata.");
        setInfo(null);
      });
  }, []);

  return (
    <div className="text-xs space-y-2">
      <div className="font-bold">[ Chroma Index Stats ]</div>
      {error && <div className="text-red-400">{error}</div>}
      {info ? (
        <pre className="bg-black border border-gray-600 p-2 text-yellow-300">
          {JSON.stringify(info, null, 2)}
        </pre>
      ) : !error ? (
        <div className="text-gray-500">Loading index metadata...</div>
      ) : null}
    </div>
  );
};

export default ChromaIndex;
