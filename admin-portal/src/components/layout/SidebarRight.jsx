import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import LetterGlitch from "/lib/LetterGlitch/LetterGlitch";


const CpuGraph = ({ title, group, color = "#4f46e5" }) => {
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
          strokeWidth="1.5"
          points={points}
          strokeLinejoin="round"
          strokeLinecap="round"
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
      <div className="clock-display">
        {clock.toLocaleTimeString("en-GB", { hour12: false })}
      </div>

      <div className="panel-box">
        <div className="panel-box-title">System</div>
        <div className="panel-box-content">
          <div className="right-grid-section">
            <div>
              <div className="section-label">Year</div>
              <div>{year}</div>
              <div>{month} {day}</div>
            </div>
            <div>
              <div className="section-label">Uptime</div>
              <div>{stats?.uptime_sec ? formatUptime(stats.uptime_sec) : "--"}</div>
            </div>
            <div>
              <div className="section-label">Type</div>
              <div>LINUX</div>
            </div>
            <div>
              <div className="section-label">Power</div>
              <div>ON</div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-box">
        <div className="panel-box-title">Performance</div>
        <div className="panel-box-content right-metrics-section">
          <div><span>Queries</span><span>{stats?.query_count ?? "--"}</span></div>
          <div><span>Latency</span><span>{stats?.avg_latency?.toFixed(0) ?? "--"} ms</span></div>
          <div><span>Tokens</span><span>{stats?.avg_tokens?.toFixed(1) ?? "--"}</span></div>
        </div>
      </div>

      <div className="panel-box">
        <div className="panel-box-title">CPU Usage</div>
        <div className="panel-box-content">
          <CpuGraph title="#1–2" group="A" />
          <CpuGraph title="#3–4" group="B" />
        </div>
      </div>

      <div className="panel-box">
        <div className="panel-box-title">Memory</div>
        <div className="panel-box-content">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
          text="MEMORY BLOCK OK"
        />

        </div>
      </div>

      <div className="panel-box">
        <div className="panel-box-title">Alerts</div>
        <div className="panel-box-content">
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
    </div>
  );
};

export default SidebarRight;
