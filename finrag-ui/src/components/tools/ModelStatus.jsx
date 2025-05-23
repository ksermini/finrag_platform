import React, { useEffect, useState } from "react";
import styles from "./tools.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const MetricCard = ({ label, value, unit, color = "cyan" }) => (
  <div className={`${styles.metricCard} ${styles[`metricCard__${color}`]}`}>
    <div className={styles.metricLabel}>{label}</div>
    <div className={styles.metricValue}>
      {value}
      {unit && <span className={styles.metricUnit}>{unit}</span>}
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
    <div className={styles.modelStatus}>
      <h2 className={styles.sectionTitle}>[ Model Status ]</h2>

      {error && <div className={styles.error}>{error}</div>}

      {!status && !error && (
        <div className={styles.loading}>Loading system metrics...</div>
      )}

      {status && (
        <div className={styles.metricGrid}>
          <MetricCard label="CPU Load" value={status.cpu} unit="%" color="cyan" />
          <MetricCard label="Avg Latency" value={status.avg_latency?.toFixed(1)} unit="ms" color="blue" />
          <MetricCard label="Token Usage" value={status.avg_tokens?.toFixed(1)} unit="tokens" color="green" />
          <MetricCard label="Query Count" value={status.query_count} unit="queries" color="purple" />
          <MetricCard label="Uptime" value={Math.floor(status.uptime_sec / 3600)} unit="h" color="orange" />
        </div>
      )}
    </div>
  );
};

export default ModelStatus;
