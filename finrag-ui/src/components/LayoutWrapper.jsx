import React from "react";

const LayoutWrapper = ({ left, center, right, bottom }) => {
  return (
    <div className="w-screen h-screen bg-black text-cyan-300 font-mono text-[10px] leading-none grid grid-cols-[180px_1fr_260px] grid-rows-[40px_40px_1fr_40px] overflow-hidden">
      {/* Row 1: Top Bar */}
      <div className="col-span-3 border-b border-cyan-600 flex items-center justify-between px-4">
        <span className="text-[11px] tracking-wide">FinRAG System Console v1.0</span>
        <span className="text-[11px] tracking-wide">{new Date().toUTCString()}</span>
      </div>

      {/* Row 2: Tabs */}
      <div className="col-span-3 flex border-b border-cyan-600 px-2 gap-[2px] text-[10px]">
        {["Terminal", "Users", "Jobs", "Logs", "Settings"].map((tab) => (
          <button
            key={tab}
            className="border border-cyan-500 bg-black px-2 py-[2px] hover:bg-cyan-900"
          >
            [{tab}]
          </button>
        ))}
      </div>

      {/* Row 3: Main Content */}
      {/* Left */}
      <div className="border-r border-cyan-600 p-[4px]">{left}</div>

      {/* Center */}
      <div className="overflow-y-auto p-[4px] border-x border-cyan-600">
        {center}
      </div>

      {/* Right */}
      <div className="p-[4px]">{right}</div>

      {/* Row 4: Bottom */}
      <div className="col-span-3 border-t border-cyan-600 p-2">{bottom}</div>
    </div>
  );
};

export default LayoutWrapper;
