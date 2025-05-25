import React, { useEffect, useState } from "react";
import DecryptedText from "../../../lib/DecryptedText/DecryptedText";

const mockLines = [
  "> Initializing FinRAG Runtime...",
  "> Loading vector memory...",
  "> ✓ Latency Engine Stable",
  "> ✓ Compliance Core Loaded",
  "> [✓] Reuters Feed Connected",
  "> [✓] RAM Watcher Online",
  "> ✓ User profile loaded: KAYLA",
  "> ✓ System state: STABLE",

  "Launching terminal..."
];

const DecryptLoader = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    if (index >= mockLines.length) {
      setTimeout(onComplete, 1000);
      return;
    }

    const timer = setTimeout(() => {
      setVisibleLines((prev) => [...prev, mockLines[index]]);
      setIndex((prev) => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="px-6 pt-12 text-green-400 font-mono text-sm">
      {visibleLines.map((line, i) => {
        const safeLine = String(line ?? "");
        return safeLine.trim() === "" ? (
          <div key={i} className="h-4" />
        ) : (
          <div key={i}>
            <DecryptedText
              text={safeLine}
              animateOn="view"                 // 👈 changed from default (hover)
              speed={15}
              maxIterations={15}
              revealDirection="start"
              className="revealed"
              encryptedClassName="encrypted"
              parentClassName="all-letters"
            />
          </div>
        );
      })}
      <div className="animate-blink">_</div>
    </div>
  );
};

export default DecryptLoader;
