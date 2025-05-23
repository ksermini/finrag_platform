import React, { useEffect, useState } from "react";
import axios from "axios";

const SidebarRight = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get("http://localhost:8000/admin/system-metrics", {
          withCredentials: true,
        });
        setStats(statsRes.data);
      } catch {
        setStats({ error: true });
      }

      try {
        const alertsRes = await axios.get("http://localhost:8000/admin/alerts", {
          withCredentials: true,
        });
        setAlerts(alertsRes.data || []);
      } catch {
        setAlerts(["Failed to fetch alerts"]);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="text-[10px] space-y-4 text-cyan-100">
      <h2 className="text-[11px] font-bold glow-text tracking-wide border-b border-cyan-500 pb-1">
        SYSTEM STATUS
      </h2>

      {stats?.error ? (
        <div className="text-red-400">Status error</div>
      ) : stats ? (
        <div className="space-y-1">
          <div><span className="text-gray-400">Queries:</span> {stats.query_count}</div>
          <div><span className="text-gray-400">Latency:</span> {stats.avg_latency.toFixed(0)} ms</div>
          <div><span className="text-gray-400">Tokens:</span> {stats.avg_tokens.toFixed(1)}</div>
          <div><span className="text-gray-400">Uptime:</span> {formatUptime(stats.uptime_sec)}</div>
        </div>
      ) : (
        <div className="text-gray-500">Loading stats...</div>
      )}

      <div className="mt-2">
        <div className="text-[11px] font-bold glow-text tracking-wide border-b border-cyan-500 pb-1">RESOURCES</div>
        {stats && !stats.error ? (
          <>
            <div><span className="text-gray-400">CPU:</span> {stats.cpu}%</div>
            <div><span className="text-gray-400">Memory:</span> {stats.mem}%</div>
          </>
        ) : (
          <div className="text-gray-500">Loading...</div>
        )}
      </div>

      <div className="mt-2">
        <div className="text-[11px] font-bold glow-text tracking-wide border-b border-cyan-500 pb-1">ALERTS</div>
        {alerts.length === 0 ? (
          <div className="text-green-400">✔ System healthy</div>
        ) : (
          <ul className="space-y-1">
            {alerts.map((alert, i) => (
              <li key={i} className="text-red-400">⚠ {alert}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SidebarRight;
