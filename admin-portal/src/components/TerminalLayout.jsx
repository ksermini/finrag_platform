import React, { useState, useEffect } from "react";
import TerminalWindow from "./TerminalWindow";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import Scanlines from "./Scanlines";
import KeyboardOverlay from "./KeyboardOverlay";

// Tool Panels
import VectorExplorer from "./tools/VectorExplorer";
import ModelStatus from "./tools/ModelStatus";
import AuditViewer from "./tools/AuditViewer";
import ChromaIndex from "./tools/ChromaIndex";
import APILogs from "./tools/APILogs";

const tabs = ["Terminal", "Users", "Jobs", "Logs", "Settings"];
const toolList = [
  "Vector Explorer",
  "Model Status",
  "Audit Viewer",
  "Chroma Index",
  "API Logs",
];

const TerminalLayout = () => {
  const [activeTab, setActiveTab] = useState("Terminal");
  const [activeTool, setActiveTool] = useState("Vector Explorer");
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const renderToolPanel = () => {
    switch (activeTool) {
      case "Vector Explorer": return <VectorExplorer />;
      case "Model Status": return <ModelStatus />;
      case "Audit Viewer": return <AuditViewer />;
      case "Chroma Index": return <ChromaIndex />;
      case "API Logs": return <APILogs />;
      default: return <div className="text-sm">Select a tool</div>;
    }
  };

  return (
    <div className="w-screen h-screen font-mono text-[9px] leading-none tracking-tight bg-black text-cyan-300 grid grid-cols-[180px_1fr_260px] grid-rows-[40px_40px_1fr_40px] overflow-hidden relative">
      <Scanlines />

      {/* Top Header */}
      <div className="col-span-3 flex justify-between items-center px-4 border-b border-cyan-600 bg-[#0b0b0b]">
        <span className="text-[11px] font-semibold">FinRAG Admin Portal v1.0</span>
        <span className="text-[11px]">{clock.toLocaleTimeString("en-GB", { hour12: false })}</span>
      </div>

      {/* Tabs */}
      <div className="col-span-3 flex items-center gap-[2px] border-b border-cyan-600 px-2 bg-[#0a0a0a]">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border border-cyan-600 px-2 py-[2px] ${
              activeTab === tab ? "bg-cyan-300 text-black" : "text-cyan-300"
            }`}
          >
            [{tab}]
          </button>
        ))}
      </div>

      {/* Left */}
      <div className="border-r border-cyan-600 bg-black p-[4px] overflow-y-auto">
        <SidebarLeft activeTool={activeTool} setActiveTool={setActiveTool} />
      </div>

      {/* Center */}
      <div className="overflow-y-auto p-[4px] bg-black border-x border-cyan-600 text-cyan-100">
        {activeTab === "Terminal" ? (
          <>
            <TerminalWindow />
            <div className="mt-2 border-t border-cyan-600 pt-2">
              {renderToolPanel()}
            </div>
          </>
        ) : (
          <div className="text-cyan-400">[{activeTab} tab coming soon]</div>
        )}
      </div>

      {/* Right */}
      <div className="p-[4px] bg-black">
        <SidebarRight />
      </div>

      {/* Bottom */}
      <div className="col-span-3 border-t border-cyan-600 bg-[#0a0a0a] px-3 py-2">
        <KeyboardOverlay />
      </div>
    </div>
  );
};

export default TerminalLayout;
