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
    <div className="w-full mb-2">
      <div className="flex justify-between text-[9px] text-cyan-300 mb-[1px]">
        <span>{title}</span>
        <span>Avg: {avg}%</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-6"
      >
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
    <div className="text-[9px] leading-tight tracking-tight text-cyan-100 space-y-[6px]">
      {/* Clock */}
      <div className="text-center text-[16px] font-bold tracking-widest text-cyan-300 border-b border-cyan-700 pb-1">
        {clock.toLocaleTimeString("en-GB", { hour12: false })}
      </div>

      {/* Date + Uptime + Type + Power */}
      <div className="grid grid-cols-2 gap-x-2 border-b border-cyan-700 pb-1">
        <div>
          <div className="text-cyan-300 text-[10px]">YEAR</div>
          <div>{year}</div>
          <div>{month} {day}</div>
        </div>
        <div>
          <div className="text-cyan-300 text-[10px]">UPTIME</div>
          <div>{stats?.uptime_sec ? formatUptime(stats.uptime_sec) : "--"}</div>
        </div>
        <div>
          <div className="text-cyan-300 text-[10px]">TYPE</div>
          <div>LINUX</div>
        </div>
        <div>
          <div className="text-cyan-300 text-[10px]">POWER</div>
          <div>ON</div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="space-y-[2px] border-b border-cyan-700 pb-1">
        <div className="flex justify-between"><span>Queries</span><span>{stats?.query_count ?? "--"}</span></div>
        <div className="flex justify-between"><span>Latency</span><span>{stats?.avg_latency?.toFixed(0) ?? "--"} ms</span></div>
        <div className="flex justify-between"><span>Tokens</span><span>{stats?.avg_tokens?.toFixed(1) ?? "--"}</span></div>
      </div>

      {/* CPU Usage */}
      <div className="border-b border-cyan-700 pb-1">
        <div className="text-gray-400 text-[9px] mb-[2px]">CPU USAGE</div>
        <CpuGraph title="#1–2" group="A" />
        <CpuGraph title="#3–4" group="B" />
      </div>

      {/* CPU Stats */}
      <div className="grid grid-cols-4 gap-x-2 border-b border-cyan-700 pb-1">
        <div><div className="text-gray-400">TEMP</div><div>62°C</div></div>
        <div><div className="text-gray-400">MIN</div><div>2.94GHz</div></div>
        <div><div className="text-gray-400">MAX</div><div>2.99GHz</div></div>
        <div><div className="text-gray-400">TASKS</div><div>257</div></div>
      </div>

      {/* Memory Usage Grid */}
      <div className="border-b border-cyan-700 pb-1">
        <div className="text-gray-400 text-[9px] mb-[2px]">MEMORY</div>
        <div className="grid grid-cols-20 gap-[1px]">
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={i}
              className={`w-[2px] h-[2px] ${
                i < memBlocks ? "bg-cyan-300" : "bg-gray-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="border-b border-cyan-700 pb-1">
        <div className="text-[9px] text-gray-400 mb-[1px]">ALERTS</div>
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
