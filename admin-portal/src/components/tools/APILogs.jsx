import React, { useEffect, useState } from "react";
import AnimatedList from "../../../lib/AnimatedList/AnimatedList";

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

  const rows = logs.map((log, i) => {
    const [ts, user, model, latency, tokens] = log.split(" | ");
    return (
      <div
        key={i}
        className="grid grid-cols-5 gap-6 text-base px-5 py-4 bg-[var(--theme-surface-muted)] rounded-lg shadow hover:bg-[var(--theme-surface)] transition w-full"
      >
        <span className="truncate">{ts}</span>
        <span className="truncate">{user}</span>
        <span className="truncate">{model}</span>
        <span className="truncate">{latency}</span>
        <span className="truncate">{tokens}</span>
      </div>
    );
    
  });

  return (
    <div className="w-full min-h-[400px]">
      <h2 className="panel-box-title text-[var(--success)] mb-4">API Logs</h2>
      {error && <div className="text-red-500 mb-3">{error}</div>}

      {/* Table Headers */}
      <div className="grid grid-cols-5 gap-6 text-xs font-semibold text-[var(--theme-muted)] mb-2 px-5">
        <span>Timestamp</span>
        <span>User</span>
        <span>Model</span>
        <span>Latency</span>
        <span>Tokens</span>
      </div>


      {/* Animated full-height logs — no fixed height */}
      <AnimatedList
        items={rows}
        showGradients={true}
        enableArrowNavigation={true}
        displayScrollbar={true}
        className="w-full"
      />
    </div>
  );
};

export default APILogs;
