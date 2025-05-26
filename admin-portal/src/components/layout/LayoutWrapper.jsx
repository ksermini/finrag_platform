import React from "react";

const LayoutWrapper = ({
  left,
  center,
  right,
  bottom,
  activeTab,
  onTabClick,
  clock,
}) => {
  const tabs = ["Terminal", "Users", "Jobs", "Logs", "Settings"];

  return (
    <div className="grid grid-cols-[64px_1fr_320px] grid-rows-[64px_1fr_40px] h-screen w-screen text-white bg-[#0a0a0a] overflow-hidden font-sans">
      
      {/* Header */}
      <div className="col-span-3 row-start-1 flex items-center justify-between px-6 bg-black/90 border-b border-white/10">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold tracking-wide">FinRAG Admin Portal v1.0</span>
          <div className="flex gap-2 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabClick(tab)}
                className={`px-3 py-1 rounded-md hover:bg-white/10 transition ${
                  activeTab === tab ? "bg-white/10 text-blue-400" : "text-white/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <span className="text-blue-400 font-mono">
          {clock.toLocaleTimeString("en-GB", { hour12: false })}
        </span>
      </div>

      {/* Left Sidebar */}
      <div className="row-span-2 bg-black/80 border-r border-white/10 overflow-y-auto">
        {left}
      </div>

      {/* Center Content */}
      <div className="overflow-y-auto px-6 py-6 space-y-6 bg-gradient-to-b from-black via-[#0e0e18] to-black scroll-smooth">
        {center}
      </div>

      {/* Right Sidebar */}
      <div className="row-span-2 bg-black/80 border-l border-white/10 overflow-y-auto">
        {right}
      </div>

      {/* Footer */}
      <div className="col-span-3 flex items-center justify-center text-sm text-blue-400 bg-black/80 border-t border-white/10">
        {bottom}
      </div>
    </div>
  );
};

export default LayoutWrapper;
