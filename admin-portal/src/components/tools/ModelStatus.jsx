import React, { useEffect, useState } from "react";
import PanelBox from "../shared/PanelBox"; // if you're using it
import styles from "./tools.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const MetricCard = ({ label, value, unit, color = "cyan" }) => (
  <div
    className={`rounded-lg p-4 bg-[var(--theme-surface)] shadow-md border border-[var(--theme-border)] hover:scale-[1.02] transition transform`}
  >
    <div className="text-xs uppercase text-[var(--theme-muted)] mb-1">{label}</div>
    <div className={`text-lg font-semibold text-${color}-400`}>
      {value}
      {unit && <span className="text-xs text-[var(--theme-muted)] ml-1">{unit}</span>}
    </div>
  </div>
);

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
    <PanelBox title="Model Status">
      <div className="tool-description">
        Shows the LLM configuration, token limits, and latency performance for current deployments.
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      {!status && !error && (
        <div className="text-theme-muted text-sm italic">Loading system metrics...</div>
      )}

      {status && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard label="CPU Load" value={status.cpu} unit="%" color="cyan" />
          <MetricCard label="Avg Latency" value={status.avg_latency?.toFixed(1)} unit="ms" color="blue" />
          <MetricCard label="Token Usage" value={status.avg_tokens?.toFixed(1)} unit="tokens" color="green" />
          <MetricCard label="Query Count" value={status.query_count} unit="queries" color="purple" />
          <MetricCard label="Uptime" value={Math.floor(status.uptime_sec / 3600)} unit="h" color="orange" />
        </div>
      )}
    </PanelBox>
  );
};

export default ModelStatus;
