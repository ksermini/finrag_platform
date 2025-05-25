import React, { useState } from "react";
import BootScreen from "./components/Boot/BootScreen";
import TerminalLayout from "./components/layout/TerminalLayout";

const App = () => {
  const [bootDone, setBootDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleFinish = () => {
    setFadeOut(true);
    setTimeout(() => {
      setBootDone(true);
    }, 1000); // matches BootScreen timing
  };

  return (
    <>
      {!bootDone && (
        <div className={`transition-opacity duration-700 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
          <BootScreen onComplete={handleFinish} />
        </div>
      )}

      {bootDone && (
        <div className="animate-fade-in opacity-100">
          <TerminalLayout />
        </div>
      )}
    </>
  );
};

export default App;
