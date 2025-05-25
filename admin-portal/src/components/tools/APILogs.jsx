import React, { useEffect, useState } from "react";
import styles from "./tools.module.css";

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
    <div className="api-logs-wrapper">
      <div className="api-logs-title">[ API Logs ]</div>
      {error && <div className="api-logs-error">{error}</div>}
      <div className="api-logs-table">
        <div className="api-logs-header">
          <span>Timestamp</span>
          <span>User</span>
          <span>Model</span>
          <span>Latency</span>
          <span>Tokens</span>
        </div>
        {logs.map((log, i) => {
          const [ts, user, model, latency, tokens] = log.split(" | ");
          return (
            <div key={i} className="api-logs-row">
              <span>{ts}</span>
              <span>{user}</span>
              <span>{model}</span>
              <span>{latency}</span>
              <span>{tokens}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default APILogs;
