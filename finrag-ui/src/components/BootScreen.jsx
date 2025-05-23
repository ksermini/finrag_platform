import React, { useEffect, useState } from "react";

const lines = [
  "[NEWS] Bank of England decision delayed...",
  "[NEWS] Germany flash PMI drops to 9-month low",
  "[NEWS] Fed’s Powell sees rate cuts as early as Sept",
  "[NEWS] Housing starts rise 14.8% in January",
  "Loading vector memory...",
  "✔ Latency Engine Stable",
  "✔ Compliance Core Loaded",
  "✔ Reuters Feed Connected",
  "✔ RAM Watcher Online",
  "✔ User profile loaded: KAYLA"
];

const BootFeed = ({ onFinish }) => {
  const [feed, setFeed] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeed(prev => [...prev, lines[index]]);
      setIndex(i => i + 1);
    }, 140);

    if (index === lines.length) {
      clearInterval(interval);
      setTimeout(onFinish, 700);
    }

    return () => clearInterval(interval);
  }, [index, onFinish]);

  return (
    <div
      className="fixed inset-0 bg-black text-[#00ffff] z-50 flex items-center justify-center"
      style={{
        fontFamily: "VT323, monospace",
        fontSize: "11px",
        lineHeight: "1.35",
        letterSpacing: "0.5px",
      }}
    >
      <div
        className="w-[80%] max-w-[1000px] h-[80%] overflow-hidden text-left"
        style={{
          whiteSpace: "pre-wrap",
          textShadow: "0 0 1px #0ff, 0 0 2px #0ff",
        }}
      >
        {feed.map((line, i) => (
          <div key={i} className="opacity-90 animate-fade-in">{line}</div>
        ))}
      </div>
    </div>
  );
};

export default BootFeed;
