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

  // Keyboard navigation for tools
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

  // Render the currently selected tool panel
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

  // Handle main tab rendering
  const renderMainContent = () => {
    if (activeTab === "Terminal") {
      return (
        <>
          <TerminalWindow />
          <div
            key={activeTool}
            className="transition-all duration-500 ease-in-out opacity-0 animate-fadeIn mt-4"
          >
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
      <div className="col-span-12 px-4 py-2 border-b border-gray-600 text-xs flex justify-between items-center augmented-panel" augmented-ui="tl-clip tr-clip border">
        <span>FinRAG System Console v1.0</span>
        <span>{new Date().toUTCString()}</span>
      </div>

      {/* Tab Bar */}
      <div className="col-span-12 flex px-4 py-1 border-b border-gray-600 space-x-4 text-xs bg-[#101010] augmented-panel" augmented-ui="bl-clip br-clip border">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 ${
              activeTab === tab ? "bg-white text-black font-bold" : "text-gray-400"
            } rounded-sm hover:text-white`}
            onClick={() => setActiveTab(tab)}
          >
            [{tab}]
          </button>
        ))}
      </div>

      {/* Left Sidebar */}
      <SidebarLeft activeTool={activeTool} setActiveTool={setActiveTool} />

      {/* Main Panel (Terminal + Tool Panel) */}
      <div
        className="col-span-8 p-4 overflow-y-auto relative text-xs text-cyan-200 font-mono shadow-[0_0_10px_#00fff7] rounded-lg border-[2px] border-cyan-400 bg-[#0e0e0e] augmented-panel"
        augmented-ui="border tl-clip tr-clip br-clip bl-clip"
      >
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('/scanlines.png')] mix-blend-soft-light pointer-events-none" />
        <div className="relative z-10">
          {renderMainContent()}
        </div>
      </div>


      {/* Right Sidebar */}
      <SidebarRight />

      {/* Bottom Overlay */}
      <div className="col-span-12 border-t border-gray-600 p-4">
        <KeyboardOverlay />
      </div>
    </div>
  );
};

export default TerminalLayout;
