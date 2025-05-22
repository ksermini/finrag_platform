import React, { useState } from "react";
import BootFeed from "./components/BootFeed";
import TerminalLayout from "./components/TerminalLayout";

const App = () => {
  const [bootDone, setBootDone] = useState(false);

  const handleFinish = () => {
    console.log("✅ Boot finished. Switching to TerminalLayout.");
    setBootDone(true);
  };

  return (
    <>
      {!bootDone && (
        <>
          {console.log("⏳ Rendering BootFeed")}
          <BootFeed onFinish={handleFinish} />
        </>
      )}
      {bootDone && <TerminalLayout />}
    </>
  );
};

export default App;
