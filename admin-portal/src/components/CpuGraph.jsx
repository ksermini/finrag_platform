import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const CpuGraph = ({ title = "#1–2", group = "A" }) => {
  const [data, setData] = useState(Array(50).fill(0));
  const requestRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/admin/system-metrics");
        const load = res.data.cpu || 0;
        const newValue =
          group === "A"
            ? Math.round(load * 0.9)
            : Math.round(load * 1.05);
        setData(prev => [...prev.slice(1), newValue]);
      } catch {
        setData(prev => [...prev.slice(1), prev[prev.length - 1] || 0]);
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
  const max = 100;
  const points = data
    .map((v, i) => {
      const x = (i / data.length) * width;
      const y = height - (v / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const avg = Math.round(data.reduce((a, b) => a + b, 0) / data.length);

  return (
    <div className="w-full">
      <div className="flex justify-between text-[9px] text-[var(--theme-fg)] mb-[2px]">
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
          stroke="var(--theme-cpu,rgb(38, 145, 145))"
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

export default CpuGraph;
