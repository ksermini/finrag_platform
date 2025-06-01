import React, { useEffect, useState } from "react";
import axios from "axios";

const TerminalWindow = () => {
  const [logs, setLogs] = useState([]);

  const playSound = (src, volume = 100) => {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play();
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await axios.get("http://localhost:8000/admin/recent-queries", {
          withCredentials: true,
        });
        const [latest] = res.data;
  
        if (!latest) {
          setLogs(["> no recent queries found"]);
          return;
        }
  
        const output = [
          `> user("${latest.user_id || '---'}")`,
          `[✓] Retrieved ${latest.retrieved_docs_count} documents`,
          `[✓] Model: ${latest.model || latest.model_name} | Latency: ${latest.latency_ms}ms`,
          `[✓] Tokens: ${latest.tokens_input} in / ${latest.tokens_output} out`,
          `[✓] Cached: ${latest.cached}`,
          `[✓] Timestamp: ${latest.timestamp}`,
        ];
  
        //  Clear logs before appending
        setLogs([]); 
  
        output.forEach((line, i) => {
          setTimeout(() => {
            setLogs((prev) => [...prev, line]);
            playSound("/sounds/key-click.mp3", 0.2);
          }, i * 500);
        });
  
        setTimeout(() => playSound("/sounds/beep.mp3", 0.3), output.length * 500);
  
      } catch (err) {
        console.error("Metadata fetch error:", err);
        setLogs(["> error: could not fetch metadata"]);
      }
    };
  
    fetchMetadata();
  }, []);
  

  return (
    <div className="terminal-window">
      {logs.map((line, i) => (
        <div key={i} className="terminal-line">{line}</div>
      ))}
      <div className="terminal-cursor">_</div>
    </div>
  );
};

export default TerminalWindow;
