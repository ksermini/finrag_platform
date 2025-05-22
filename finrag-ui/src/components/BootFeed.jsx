import React, { useEffect, useState } from "react";
import axios from "axios";

const BootFeed = ({ onFinish }) => {
  const [lines, setLines] = useState([]);
  const [displayed, setDisplayed] = useState([]);

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const res = await axios.get("http://localhost:8000/feed/news");
        const feedLines = res.data.map((title, i) => `> ${title}`);
        setLines(feedLines);
      } catch {
        setLines(["> Failed to load headlines."]);
      }
    };

    fetchHeadlines();
  }, []);

  useEffect(() => {
    if (lines.length === 0) return;
    let i = 0;

    const interval = setInterval(() => {
      setDisplayed((prev) => [...prev, lines[i]]);
      i += 1;
      if (i === lines.length) {
        clearInterval(interval);
        setTimeout(onFinish, 1500);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lines]);

  return (
    <div className="fixed inset-0 bg-black text-white font-mono text-sm p-6 z-50 overflow-hidden">
      <div className="scanline flicker h-full w-full absolute top-0 left-0 pointer-events-none"></div>
      <div className="whitespace-pre-wrap">
        {displayed.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
        <div className="animate-blink">_</div>
      </div>
    </div>
  );
};

export default BootFeed;
