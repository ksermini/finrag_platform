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
      <div className="cpu-graph-header flex justify-between text-[11px] text-theme-muted mb-1">
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
  const [stats, setStats] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const fetch = async () => {
      try {
        const [sys, alert] = await Promise.all([
          axios.get("http://localhost:8000/admin/system-metrics"),
          axios.get("http://localhost:8000/admin/alerts"),
        ]);
        setStats(sys.data);
        setAlerts(alert.data || []);
      } catch {
        setStats({});
        setAlerts(["⚠ Unable to fetch system metrics."]);
      }
    };
    fetch();
    const interval = setInterval(() => {
      setClock(new Date());
      fetch();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const time = clock.toLocaleTimeString("en-GB", { hour12: false });
  const formatUptime = (s = 0) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    return `${d}d${h}:${m}`;
  };

  return (
    <div className="sidebar-right p-2 text-[11px] text-theme-fg space-y-3 font-ui bg-[var(--theme-bg)] border-l border-theme-border">

      {/* Clock */}
      <div className="text-center text-[16px] font-semibold tracking-widest text-theme-accent mb-2">
        {time}
      </div>

      {/* SYSTEM */}
      <div className="panel-box bento glass-style">
        <div className="text-theme-muted uppercase text-[10px] mb-1">System</div>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          <div>
            <div className="section-label">Year</div>
            <div>{clock.getFullYear()}</div>
            <div>{clock.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}</div>
          </div>
          <div>
            <div className="section-label">Uptime</div>
            <div>{formatUptime(stats?.uptime_sec)}</div>
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

      {/* PERFORMANCE */}
      <div className="panel-box bento glass-style">
        <div className="text-theme-muted uppercase text-[10px] mb-1">Performance</div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Queries</span>
            <span className="text-right block w-12">{stats?.query_count ?? "--"}</span>
          </div>
          <div className="flex justify-between">
            <span>Latency</span>
            <span className="text-right block w-12">{stats?.avg_latency?.toFixed(0) ?? "--"}ms</span>
          </div>
          <div className="flex justify-between">
            <span>Tokens</span>
            <span className="text-right block w-12">{stats?.avg_tokens?.toFixed(1) ?? "--"}</span>
          </div>
        </div>
      </div>

      {/* CPU */}
      <div className="panel-box bento glass-style">
        <div className="text-theme-muted uppercase text-[10px] mb-1">CPU Usage</div>
        <div className="space-y-2">
          <CpuGraph title="#1–2" group="A" />
          <CpuGraph title="#3–4" group="B" />
        </div>
      </div>

      {/* MEMORY */}
      <div className="panel-box bento glass-style">
        <div className="text-theme-muted uppercase text-[10px] mb-1">Memory</div>
        <div className="h-[60px] overflow-hidden">
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
            text="MEMORY BLOCK OK"
          />
        </div>
      </div>

      {/* ALERTS */}
      <div className="panel-box bento glass-style">
        <div className="text-theme-muted uppercase text-[10px] mb-1">Alerts</div>
        {alerts.length ? (
          <ul className="alert-list space-y-1 text-[12px] leading-tight">
            {alerts.map((a, i) => (
              <li key={i} className="alert-warning">⚠ {a}</li>
            ))}
          </ul>
        ) : (
          <div className="alert-ok text-[12px]">✔ System healthy</div>
        )}
      </div>

    </div>
  );
};

export default SidebarRight;
