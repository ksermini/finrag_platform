import React, { useEffect, useState } from "react";
import styles from "./tools.module.css";

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
    <div className="audit-viewer">
      <h2 className="audit-title">[ Audit Logs ]</h2>
      {error && <div className="audit-error">{error}</div>}

      <div className="audit-table-wrapper">
        <div className="audit-table-head">
          <div>Timestamp</div>
          <div>User</div>
          <div>Model</div>
          <div>Latency</div>
          <div>Tokens</div>
          <div>Cached</div>
          <div>Source</div>
        </div>

        {logs.map((log, i) => (
          <div key={i} className="audit-table-row">
            <div>{log.timestamp?.split("T")[0]}</div>
            <div>{log.user_id}</div>
            <div>{log.model}</div>
            <div>{log.latency_ms} ms</div>
            <div>{log.tokens_input} / {log.tokens_output}</div>
            <div>{log.cached ? "Yes" : "No"}</div>
            <div>{log.source_type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditViewer;
