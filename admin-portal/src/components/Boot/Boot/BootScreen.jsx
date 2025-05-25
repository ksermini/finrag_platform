import React, { useState } from "react";
import DecryptLoader from "./DecryptLoader";

const BootScreen = ({ onComplete }) => {
  const [bootComplete, setBootComplete] = useState(false);

  const handleFinish = () => {
    setBootComplete(true);
    onComplete();
  };

  return (
    <div className="h-screen w-screen bg-black text-green-400 font-mono flex flex-col justify-center items-start">
      {!bootComplete && <DecryptLoader onComplete={handleFinish} />}
    </div>
  );
};

export default BootScreen;
