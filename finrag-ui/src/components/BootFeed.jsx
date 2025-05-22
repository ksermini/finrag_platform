import React, { useEffect, useState } from "react";

const BootFeed = ({ onFinish }) => {
  const [lines, setLines] = useState([]);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log("🟢 BootFeed mounted");

    // Static test content
    const bootLines = [
      "> Initializing system...",
      "> Loading modules...",
      "> Connecting to FinRAG...",
      "> FinRAG v1.0 Ready ✅",
      "",
      "WELCOME TO FINRAG",
      "Launching terminal..."
    ];

    setLines(bootLines);
  }, []);

  useEffect(() => {
    if (lines.length === 0) return;

    const interval = setInterval(() => {
      setDisplayedLines((prev) => [...prev, lines[currentIndex]]);
      setCurrentIndex((prev) => prev + 1);

      if (currentIndex + 1 >= lines.length) {
        clearInterval(interval);
        setTimeout(() => {
          console.log("✅ BootFeed complete. Calling onFinish.");
          onFinish();
        }, 1500);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [lines, currentIndex]);

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono text-sm z-50 p-6">
      <div className="whitespace-pre-wrap leading-relaxed">
        {displayedLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div className="animate-blink">_</div>
      </div>
    </div>
  );
};

export default BootFeed;
