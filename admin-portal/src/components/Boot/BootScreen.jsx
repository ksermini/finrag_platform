import React, { useState } from "react";
import DecryptLoader from "./DecryptLoader";

const BootScreen = ({ onComplete }) => {
  const [bootComplete, setBootComplete] = useState(false);

  const handleFinish = () => {
    setBootComplete(true);
    onComplete();
  };

  return (
    <div className="boot-screen">
      {!bootComplete && <DecryptLoader onComplete={handleFinish} />}
    </div>
  );
};

export default BootScreen;
