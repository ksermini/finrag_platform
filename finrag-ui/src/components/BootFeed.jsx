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

const BootFeed = ({ onFinish }) => {
  const [lines, setLines] = useState([]);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Mock stock chart data
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
    scales: {
      x: { display: false },
      y: { display: false },
    },
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
          "WELCOME TO FINRAG",
          "",
          "Launching terminal..."
        ];
        setLines([...rssLines, ...bootLogs]);
      } catch (err) {
        console.error("[BootFeed] RSS fetch failed:", err);
        setLines([
          "> ⚠️ Failed to fetch news feed.",
          "> Proceeding with system boot...",
          "",
          "WELCOME TO FINRAG",
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
        setTimeout(onFinish, 1500);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [lines, currentIndex]);

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono text-sm z-50 overflow-hidden flex flex-col">
      {/* Chart on top */}
      <div className="h-32 w-full z-10 opacity-40">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Terminal feed below chart, scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 z-20 whitespace-pre-wrap leading-relaxed">
        {displayedLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div className="animate-blink">_</div>
      </div>
    </div>
  );
};

export default BootFeed;
