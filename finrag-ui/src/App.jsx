// import React, { useState } from 'react'
// import BootScreen from './components/BootScreen'
// import TerminalLayout from './components/TerminalLayout'

// const App = () => {
//   const [bootComplete, setBootComplete] = useState(false)

//   return (
//     <>
//       {!bootComplete && <BootScreen onFinish={() => setBootComplete(true)} />}
//       {bootComplete && <TerminalLayout />}
//     </>
//   )
// }

// export default App
import React, { useState } from "react";
import BootFeed from "./components/BootFeed";
import TerminalLayout from "./components/TerminalLayout";

const App = () => {
  const [booted, setBooted] = useState(false);

  return (
    <>
      {!booted && <BootFeed onFinish={() => setBooted(true)} />}
      {booted && <TerminalLayout />}
    </>
  );
};

export default App;

