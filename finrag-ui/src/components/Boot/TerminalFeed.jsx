import React, { useEffect, useState } from "react";
import DecryptedText from "../../lib/reactbits/DecryptedText"; // Adjust path if needed

const DecryptFeed = ({ onFinish }) => {
  const [lines, setLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showedLines, setShowedLines] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
    if (currentLineIndex >= lines.length) {
      setTimeout(onFinish, 800);
      return;
    }

    const timeout = setTimeout(() => {
      setShowedLines((prev) => [...prev, lines[currentLineIndex]]);
      setCurrentLineIndex((prev) => prev + 1);
    }, 1000); // delay between lines

    return () => clearTimeout(timeout);
  }, [currentLineIndex, lines]);

  return (
    <div className="px-6 pt-8 text-green-400 font-mono text-sm">
      {showedLines.map((line, idx) => (
        <div key={idx} className="pb-1">
          <DecryptedText
            text={line}
            animateOn="view"
            revealDirection="start"
            speed={20}
            maxIterations={12}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?<>/\\"
            className="revealed"
            encryptedClassName="encrypted"
            parentClassName="all-letters"
          />
        </div>
      ))}
    </div>
  );
};

export default DecryptFeed;
