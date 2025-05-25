import { useEffect, useState } from "react";

export const useBootSequence = () => {
  const [phase, setPhase] = useState("BOOTING");

  useEffect(() => {
    const sequence = [
      { delay: 3000, next: "WELCOME" },
      { delay: 2500, next: "DASHBOARD" },
    ];

    let total = 0;
    sequence.forEach(({ delay, next }) => {
      total += delay;
      setTimeout(() => setPhase(next), total);
    });
  }, []);

  return phase;
};
