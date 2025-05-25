import React, { useEffect, useState } from "react";
import DecryptedText from "../../lib/reactbits/DecryptedText"; // Adjust if needed


const DecryptLoader = ({ onFinish }) => {
  const [lines, setLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [startNext, setStartNext] = useState(false);
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
        setStartNext(true); // trigger first line
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
        setStartNext(true);
      }
    };

    fetchFeed();
  }, []);

  const handleLineComplete = () => {
    if (currentLineIndex + 1 >= lines.length) {
      setTimeout(() => onFinish?.(), 1000);
      return;
    }

    setTimeout(() => {
      setDisplayedLines((prev) => [...prev, lines[currentLineIndex + 1]]);
      setCurrentLineIndex((prev) => prev + 1);
    }, 400); // wait before decrypting next line
  };

  return (
    <div className="px-6 pt-12 text-green-400 font-mono text-sm">
      {displayedLines.map((line, idx) => (
        <div key={idx} className="pb-1">
          <DecryptedText
            key={idx}
            text={line}
            speed={25}
            maxIterations={20}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]{}<>?/\\|"
            revealDirection="start"
            className="revealed"
            encryptedClassName="encrypted"
            parentClassName="all-letters"
            animateOn={undefined}
          />
        </div>
      ))}

      {/* Kick off the first line manually */}
      {startNext && displayedLines.length === 0 && (
        <div className="pb-1">
          <DecryptedText
            key={"first"}
            text={lines[0] || ""}
            speed={25}
            maxIterations={20}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]{}<>?/\\|"
            revealDirection="start"
            className="revealed"
            encryptedClassName="encrypted"
            parentClassName="all-letters"
            animateOn={undefined}
            onAnimationComplete={handleLineComplete}
          />
        </div>
      )}

      {/* Continue revealing next line */}
      {displayedLines.length > 0 &&
        displayedLines.length === currentLineIndex &&
        currentLineIndex < lines.length - 1 && (
          <div className="pb-1">
            <DecryptedText
              key={`line-${currentLineIndex}`}
              text={lines[currentLineIndex]}
              speed={25}
              maxIterations={20}
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]{}<>?/\\|"
              revealDirection="start"
              className="revealed"
              encryptedClassName="encrypted"
              parentClassName="all-letters"
              animateOn={undefined}
              onAnimationComplete={handleLineComplete}
            />
          </div>
        )}
    </div>
  );
};

export default DecryptLoader;
