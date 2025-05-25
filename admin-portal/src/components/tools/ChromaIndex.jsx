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
    <div className="chroma-index">
      <h2 className="chroma-index-title">[ Chroma Index Stats ]</h2>
      {error && <div className="chroma-index-error">{error}</div>}

      {info ? (
        <pre className="chroma-index-json">
          {JSON.stringify(info, null, 2)}
        </pre>
      ) : !error ? (
        <div className="chroma-index-loading">Loading index metadata...</div>
      ) : null}
    </div>
  );
};

export default ChromaIndex;
