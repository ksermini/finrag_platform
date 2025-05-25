import React, { useState, useEffect } from "react";

const TypewriterText = ({
  text,
  speed = 40,
  className = "",
  cursor = true,
  delay = 0,
}) => {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        setIndex(index + 1);
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [index, speed, text]);

  useEffect(() => {
    const start = setTimeout(() => setIndex(0), delay);
    return () => clearTimeout(start);
  }, [delay]);

  return (
    <span className={className}>
      {displayed}
      {cursor && <span className="animate-pulse">|</span>}
    </span>
  );
};

export default TypewriterText;
