import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

const BootScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 800);
          return 100;
        }
        return prev + 2 + Math.random() * 4;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: Array.from({ length: progress }, (_, i) => i),
    datasets: [
        {
          data: Array.from({ length: progress }, (_, i) =>
            4000 + Math.sin(i / 10) * 100 + Math.random() * 50
          ),
          borderColor: "#ffffff",
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
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white z-50 font-mono">
      <div className="text-xl mb-4">Booting FinRAG system...</div>
      <Line data={chartData} options={chartOptions} height={100} />
      <div className="mt-4 text-sm animate-blink">Loading modules...</div>
    </div>
  );
};

export default BootScreen;
