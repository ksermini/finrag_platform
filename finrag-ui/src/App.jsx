import React, { useState } from "react";
import BootFeed from "./components/BootFeed";
import TerminalLayout from "./components/TerminalLayout";

const App = () => {
  const [bootDone, setBootDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleFinish = () => {
    setFadeOut(true);
    setTimeout(() => {
      setBootDone(true);
    }, 800); // sync with BootFeed fade duration
  };

  return (
    <>
      {!bootDone && (
        <div
          className={`transition-opacity duration-700 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <BootFeed onFinish={handleFinish} />
        </div>
      )}

      {bootDone && (
        <div className="animate-fade-in opacity-0">
          <TerminalLayout />
        </div>
      )}
    </>
  );
};

export default App;
