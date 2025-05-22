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

  return (
    <div className="col-span-2 border-l border-gray-600 p-2 text-[10px] text-right space-y-2">
      <div className="text-left">SYSTEM STATUS</div>

      {stats?.error ? (
        <div className="text-red-400 text-left">Status error</div>
      ) : stats ? (
        <>
          <div className="text-left">Queries: {stats.query_count}</div>
          <div className="text-left">Latency: {stats.avg_latency}ms</div>
          <div className="text-left">Tokens: {stats.avg_tokens}</div>
        </>
      ) : (
        <div className="text-gray-500 text-left">Loading stats...</div>
      )}

      <div className="mt-2 text-left text-gray-300">ALERTS</div>
      {alerts.length === 0 ? (
        <div className="text-green-500 text-left">System healthy ✅</div>
      ) : (
        <ul className="text-left space-y-1">
          {alerts.map((alert, i) => (
            <li key={i} className="text-red-400">⚠ {alert}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarRight;
