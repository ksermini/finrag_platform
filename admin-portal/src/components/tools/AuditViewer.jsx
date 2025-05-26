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
    <>
      <div className="tool-description">
        View recent user activity, RAG queries, feedback logs, and system decisions for compliance or debugging.
      </div>

      <div className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-muted)] p-4 shadow-sm">
        <h2 className="panel-box-title text-[var(--success)] mb-4">Audit Logs</h2>

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

        <div className="overflow-auto max-h-[500px]">
          <table className="min-w-full text-sm font-mono border-collapse">
            <thead className="sticky top-0 bg-[var(--theme-surface-muted)] z-10 text-[var(--theme-muted)] uppercase text-xs border-b border-[var(--theme-border)]">
              <tr>
                <th className="px-3 py-2 text-left">Timestamp</th>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Model</th>
                <th className="px-3 py-2 text-right">Latency</th>
                <th className="px-3 py-2 text-right">Tokens</th>
                <th className="px-3 py-2 text-center">Cached</th>
                <th className="px-3 py-2 text-left">Source</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition"
                >
                  <td className="px-3 py-2">{log.timestamp?.split("T")[0]}</td>
                  <td className="px-3 py-2">{log.user_id}</td>
                  <td className="px-3 py-2">{log.model}</td>
                  <td className="px-3 py-2 text-right">{log.latency_ms} ms</td>
                  <td className="px-3 py-2 text-right">
                    {log.tokens_input} / {log.tokens_output}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {log.cached ? "✔" : "—"}
                  </td>
                  <td className="px-3 py-2">{log.source_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AuditViewer;
