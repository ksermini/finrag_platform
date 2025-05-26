import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(PointElement, LinearScale, Title, Tooltip, Legend);

const topics = ["Finance", "Legal", "Healthcare", "Tech", "Energy"];
const topicColors = {
  Finance: "#4f46e5",
  Legal: "#10b981",
  Healthcare: "#f59e0b",
  Tech: "#ec4899",
  Energy: "#6366f1",
};

// Simulate 2D clusters with better separation
function generateMock2DClusters(n = 100) {
  const clusters = [];

  for (let i = 0; i < n; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const index = topics.indexOf(topic);

    const spread = 0.15; // horizontal spacing
    const baseX = 0.1 + index * spread;
    const baseY = 0.5 + Math.sin(index * 1.5) * 0.2; // Y variance

    const jitterX = (Math.random() - 0.5) * 0.04;
    const jitterY = (Math.random() - 0.5) * 0.1;

    clusters.push({
      x: parseFloat((baseX + jitterX).toFixed(3)),
      y: parseFloat((baseY + jitterY).toFixed(3)),
      topic,
      label: `Chunk-${i + 1}`,
    });
  }

  return clusters;
}

const ChromaIndex = () => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    setPoints(generateMock2DClusters());
  }, []);

  const scatterData = {
    datasets: topics.map((topic) => ({
      label: topic,
      data: points.filter((p) => p.topic === topic),
      backgroundColor: topicColors[topic],
      pointRadius: 5,
      pointHoverRadius: 7,
    })),
  };

  return (
    <>
      <div className="tool-description">
        This panel simulates and visualizes clustered document embeddings from a vector database like ChromaDB. Each dot represents a chunk positioned in a 2D vector space, grouped by topic.
      </div>
  
      <div className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-muted)] p-6 shadow-sm">
        <div className="text-xs uppercase tracking-wide text-[var(--theme-muted)] mb-3">
          Simulated Vector Clusters (2D)
        </div>
  
        {points.length > 0 ? (
          <div className="h-[400px]">
            <Scatter
              data={scatterData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    min: 0,
                    max: 1,
                    title: {
                      display: true,
                      text: "Embedding Axis X",
                      color: "#9ca3af",
                    },
                    ticks: { color: "#9ca3af" },
                    grid: { color: "#1f2937" },
                  },
                  y: {
                    min: 0,
                    max: 1,
                    title: {
                      display: true,
                      text: "Embedding Axis Y",
                      color: "#9ca3af",
                    },
                    ticks: { color: "#9ca3af" },
                    grid: { color: "#1f2937" },
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (ctx) => `${ctx.raw.label} (${ctx.raw.topic})`,
                    },
                    backgroundColor: "#1f2937",
                    titleColor: "#f3f4f6",
                    bodyColor: "#e5e7eb",
                  },
                  legend: {
                    labels: {
                      color: "#cbd5e1",
                      font: {
                        size: 12,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="text-theme-muted text-sm italic">Generating vectors...</div>
        )}
      </div>
    </>
  );
};  

export default ChromaIndex;
