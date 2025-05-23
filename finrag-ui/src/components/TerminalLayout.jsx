import React, { useState, useEffect } from "react";
import TerminalWindow from "./TerminalWindow";
import KeyboardOverlay from "./KeyboardOverlay";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import UsersTab from "./tabs/UsersTab";
import Scanlines from "./Scanlines";

// Tool panels
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab !== "Terminal") return;
      const index = toolList.indexOf(activeTool);
      if (e.key === "ArrowDown") {
        setActiveTool(toolList[(index + 1) % toolList.length]);
      } else if (e.key === "ArrowUp") {
        setActiveTool(toolList[(index - 1 + toolList.length) % toolList.length]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTool, activeTab]);

  const renderToolPanel = () => {
    switch (activeTool) {
      case "Vector Explorer":
        return <VectorExplorer />;
      case "Model Status":
        return <ModelStatus />;
      case "Audit Viewer":
        return <AuditViewer />;
      case "Chroma Index":
        return <ChromaIndex />;
      case "API Logs":
        return <APILogs />;
      default:
        return <div className="text-sm">Select a tool</div>;
    }
  };

  const renderMainContent = () => {
    if (activeTab === "Terminal") {
      return (
        <>
          <TerminalWindow />
          <div key={activeTool} className="mt-4 animate-fade-in">
            {renderToolPanel()}
          </div>
        </>
      );
    }

    switch (activeTab) {
      case "Users":
        return <UsersTab />;
      case "Jobs":
        return <div className="text-sm">[Jobs tab coming soon]</div>;
      case "Logs":
        return <div className="text-sm">[Logs tab coming soon]</div>;
      case "Settings":
        return <div className="text-sm">[Settings tab coming soon]</div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen bg-black text-white font-mono grid grid-cols-12 grid-rows-[auto_auto_1fr_auto] overflow-hidden relative">
      <Scanlines />

      {/* Top Bar */}
      <div className="col-span-12 px-4 py-2 border-b border-cyan-400 text-xs flex justify-between items-center bg-[#0d0d0d] augmented-panel" augmented-ui="tl-clip tr-clip border">
        <span>FinRAG System Console v1.0</span>
        <span>{new Date().toUTCString()}</span>
      </div>

      {/* Tabs */}
      <div className="col-span-12 flex px-4 py-1 border-b border-cyan-400 space-x-4 text-xs bg-[#111] augmented-panel" augmented-ui="bl-clip br-clip border">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 ${activeTab === tab ? "bg-white text-black font-bold" : "text-cyan-400"} rounded-sm hover:text-white`}
            onClick={() => setActiveTab(tab)}
          >
            [{tab}]
          </button>
        ))}
      </div>

      {/* Left Sidebar (2 cols) */}
      <div className="col-span-2 border-r border-cyan-400 bg-[#050505] p-2">
        <SidebarLeft activeTool={activeTool} setActiveTool={setActiveTool} />
      </div>

      {/* Main Panel (8 cols) */}
      <div className="col-span-8 relative p-4 text-xs text-cyan-200 shadow-inner shadow-cyan-500/10 bg-[#0e0e0e] augmented-panel overflow-y-auto"
        augmented-ui="border tl-clip tr-clip br-clip bl-clip"
      >
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('/scanlines.png')] mix-blend-soft-light pointer-events-none" />
        <div className="relative z-10">
          {renderMainContent()}
        </div>
      </div>

      {/* Right Sidebar (2 cols) */}
      <div className="col-span-2 border-l border-cyan-400 bg-[#050505] p-2">
        <SidebarRight />
      </div>

      {/* Bottom Overlay */}
      <div className="col-span-12 border-t border-cyan-400 p-3 bg-black">
        <KeyboardOverlay />
      </div>
    </div>
  );
};

export default TerminalLayout;
