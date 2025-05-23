import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);
import { useTheme } from "../context/ThemeContext";

const BootFeed = ({ onFinish }) => {
  const { theme } = useTheme();
  const [lines, setLines] = useState([]);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const chartData = {
    labels: Array.from({ length: 50 }, (_, i) => i),
    datasets: [
      {
        label: "S&P 500 (Mock)",
        data: Array.from({ length: 50 }, (_, i) =>
          4000 + Math.sin(i / 5) * 40 + Math.random() * 20
        ),
        borderColor: "#00FF66",
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    animation: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch(`${API_BASE}/feed/news`);
        const data = await res.json();
        const rssLines = data.map((title) => `> [NEWS] ${title}`);

        const bootLogs = [
          "> Initializing FinRAG Runtime...",
          "> Loading vector memory...",
          "> ✓ Latency Engine Stable",
          "> ✓ Compliance Core Loaded",
          "> [✓] Reuters Feed Connected",
          "> [✓] RAM Watcher Online",
          "> ✓ User profile loaded: KAYLA",
          "> ✓ System state: STABLE",
          "",
          "╔════════════════════════════╗",
          "║     WELCOME TO FinRAG      ║",
          "║        Version 1.0         ║",
          "╚════════════════════════════╝",
          "",
          "Launching terminal..."
        ];

        setLines([...rssLines, ...bootLogs]);
      } catch {
        setLines([
          "> ⚠️ Failed to fetch news feed.",
          "> Proceeding with system boot...",
          "",
          "╔════════════════════════════╗",
          "║     WELCOME TO FinRAG      ║",
          "║        Version 1.0         ║",
          "╚════════════════════════════╝",
          "",
          "Launching terminal..."
        ]);
      }
    };

    fetchFeed();
  }, []);

  useEffect(() => {
    if (lines.length === 0) return;

    const interval = setInterval(() => {
      setDisplayedLines((prev) => [...prev, lines[currentIndex]]);
      setCurrentIndex((prev) => prev + 1);

      if (currentIndex + 1 >= lines.length) {
        clearInterval(interval);
        setTimeout(onFinish, 1000); // shorter pause
      }
    }, 100); // ⏩ faster typing speed

    return () => clearInterval(interval);
  }, [lines, currentIndex]);

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono text-sm z-50 overflow-hidden relative">
      {/* 🌐 CRT scanlines */}
      {/* <div className="scanline-overlay" /> */}

      {/* 📊 Chart */}
      <div className="absolute top-0 left-0 w-full h-32 z-40 pointer-events-none opacity-40">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* 🟢 Terminal feed */}
      <div className="flex-1 overflow-y-auto px-6 pt-36 z-30 whitespace-pre-wrap leading-relaxed">
        {displayedLines.map((line, i) => (
          <div key={i} className="glow-text">{line}</div>
        ))}
        <div className="animate-blink">_</div>
      </div>
    </div>
  );
};

export default BootFeed;
