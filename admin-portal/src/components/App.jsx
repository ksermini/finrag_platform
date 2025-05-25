import React, { useState } from "react";
import BootScreen from "./components/Boot/BootScreen";
import AdminLayout from "./components/AdminLayout";

const App = () => {
  const [booted, setBooted] = useState(false);

  return booted ? <AdminLayout /> : <BootScreen onComplete={() => setBooted(true)} />;
};

export default App;
