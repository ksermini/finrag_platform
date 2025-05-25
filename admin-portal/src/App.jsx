import React, { useState } from "react";
import BootScreen from "./components/Boot/BootScreen";
import TerminalLayout from "./components/TerminalLayout";

// const App = () => {
//   const [booted, setBooted] = useState(false);

//   return booted ? (
//     <AdminLayout /> // 👈 Use your bento admin dashboard here
//   ) : (
//     <BootScreen onComplete={() => setBooted(true)} />
//   );
// };

// export default App;

const App = () => {
  const [bootDone, setBootDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleFinish = () => {
    setFadeOut(true);
    setTimeout(() => {
      setBootDone(true);
    }, 800);
  };

  return (
    <>
      {!bootDone && (
        <div className={`transition-opacity duration-700 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
          <BootScreen onComplete={handleFinish} />
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
