import React from "react";
import { useBootSequence } from "./useBootSequence";
import DecryptLoader from "./DecryptLoader";
import TerminalFeed from "./TerminalFeed";

const BootScreen = ({ onComplete }) => {
  const phase = useBootSequence();

  if (phase === "DASHBOARD") {
    onComplete();
    return null;
  }

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-start text-white overflow-hidden transition-all duration-700">
      <div className="pt-24 px-6 w-full max-w-5xl">
        {phase === "BOOTING" && (
          <>
            <DecryptLoader />
            <TerminalFeed onFinish={() => {}} />
          </>
        )}
        {phase === "WELCOME" && (
          <div className="text-center mt-10 text-xl font-mono animate-fade-in">
            Welcome, Analyst. Loading Admin Console...
          </div>
        )}
      </div>
    </div>
  );
};

export default BootScreen;
