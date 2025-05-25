import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const CpuGraph = ({ title, group, color = "#00ffff" }) => {
  const [data, setData] = useState(Array(50).fill(0));
  const requestRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/admin/system-metrics");
        const base = res.data.cpu || 0;
        const value = group === "A" ? base * 0.9 : base * 1.05;
        setData(prev => [...prev.slice(1), Math.round(value)]);
      } catch {
        setData(prev => [...prev.slice(1), prev.at(-1)]);
      }
    };
    const tick = () => {
      fetchData();
      requestRef.current = setTimeout(tick, 1000);
    };
    requestRef.current = setTimeout(tick, 1000);
    return () => clearTimeout(requestRef.current);
  }, [group]);

  const height = 30;
  const width = 100;
  const points = data
    .map((v, i) => {
      const x = (i / data.length) * width;
      const y = height - (v / 100) * height;
      return `${x},${y}`;
    })
    .join(" ");
  const avg = Math.round(data.reduce((a, b) => a + b, 0) / data.length);

  return (
    <div className="cpu-graph">
      <div className="cpu-graph-header">
        <span>{title}</span>
        <span>Avg: {avg}%</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="cpu-graph-svg">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1"
          points={points}
          strokeLinejoin="miter"
          strokeLinecap="square"
          shapeRendering="crispEdges"
        />
      </svg>
    </div>
  );
};

const SidebarRight = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const s = await axios.get("http://localhost:8000/admin/system-metrics");
        const a = await axios.get("http://localhost:8000/admin/alerts");
        setStats(s.data);
        setAlerts(a.data || []);
      } catch {
        setStats({ error: true });
        setAlerts(["Failed to fetch alerts"]);
      }
    };
    fetchStats();
    const timer = setInterval(() => setClock(new Date()), 1000);
    const poll = setInterval(fetchStats, 30000);
    return () => {
      clearInterval(timer);
      clearInterval(poll);
    };
  }, []);

  const formatUptime = (s) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    return `${d}d${h}:${m}`;
  };

  const year = clock.getFullYear();
  const month = clock.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = clock.getDate();
  const memBlocks = Math.min(200, Math.round((stats?.mem ?? 60 * 2)));

  return (
    <div className="sidebar-right">
      <div className="clock-display">{clock.toLocaleTimeString("en-GB", { hour12: false })}</div>

      <div className="right-grid-section">
        <div>
          <div className="section-label">YEAR</div>
          <div>{year}</div>
          <div>{month} {day}</div>
        </div>
        <div>
          <div className="section-label">UPTIME</div>
          <div>{stats?.uptime_sec ? formatUptime(stats.uptime_sec) : "--"}</div>
        </div>
        <div>
          <div className="section-label">TYPE</div>
          <div>LINUX</div>
        </div>
        <div>
          <div className="section-label">POWER</div>
          <div>ON</div>
        </div>
      </div>

      <div className="right-metrics-section">
        <div><span>Queries</span><span>{stats?.query_count ?? "--"}</span></div>
        <div><span>Latency</span><span>{stats?.avg_latency?.toFixed(0) ?? "--"} ms</span></div>
        <div><span>Tokens</span><span>{stats?.avg_tokens?.toFixed(1) ?? "--"}</span></div>
      </div>

      <div className="right-graph-section">
        <div className="section-label">CPU USAGE</div>
        <CpuGraph title="#1–2" group="A" />
        <CpuGraph title="#3–4" group="B" />
      </div>

      <div className="right-grid-section">
        <div><div className="section-label">TEMP</div><div>62°C</div></div>
        <div><div className="section-label">MIN</div><div>2.94GHz</div></div>
        <div><div className="section-label">MAX</div><div>2.99GHz</div></div>
        <div><div className="section-label">TASKS</div><div>257</div></div>
      </div>

      <div className="right-memory-section">
        <div className="section-label">MEMORY</div>
        <div className="memory-grid">
          {Array.from({ length: 200 }).map((_, i) => (
            <div key={i} className={`memory-dot ${i < memBlocks ? "active" : ""}`} />
          ))}
        </div>
      </div>

      <div className="right-alerts-section">
        <div className="section-label">ALERTS</div>
        {alerts.length === 0 ? (
          <div className="alert-ok">✔ System healthy</div>
        ) : (
          <ul className="alert-list">
            {alerts.map((alert, i) => (
              <li key={i} className="alert-warning">⚠ {alert}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SidebarRight;
