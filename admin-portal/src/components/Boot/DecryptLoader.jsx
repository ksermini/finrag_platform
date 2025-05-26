import React, { useEffect, useState } from "react";
import DecryptedText from "../../../lib/DecryptedText/DecryptedText";

const mockLines = [
  // You can uncomment more lines if needed
  "> Initializing FinRAG Runtime...",
  "> Loading vector memory...",
  "> ✓ Latency Engine Stable",
  "> ✓ Compliance Core Loaded",
  "> [✓] Reuters Feed Connected",
  "> [✓] RAM Watcher Online",
  // "> ✓ User profile loaded: KAYLA",
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
    <div className="decrypt-loader">
      {visibleLines.map((line, i) => {
        const safeLine = String(line ?? "");
        return safeLine.trim() === "" ? (
          <div key={i} className="decrypt-line-spacer" />
        ) : (
          <div key={i}>
            <DecryptedText
              text={safeLine}
              animateOn="view"
              speed={25}
              maxIterations={15}
              revealDirection="start"
              className="revealed"
              encryptedClassName="encrypted"
              parentClassName="all-letters"
            />
          </div>
        );
      })}
      <div className="decrypt-cursor">_</div>
    </div>
  );
};

export default DecryptLoader;
