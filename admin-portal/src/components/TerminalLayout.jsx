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
      default: return <div className="tool-placeholder">Select a tool</div>;
    }
  };

  return (
    <div className="terminal-layout">
      <Scanlines />

      {/* Header */}
      <div className="layout-header">
        <span className="layout-header-title">FinRAG Admin Portal v1.0</span>
        <span className="layout-header-clock">
          {clock.toLocaleTimeString("en-GB", { hour12: false })}
        </span>
      </div>

      {/* Tabs */}
      <div className="layout-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`layout-tab-btn ${activeTab === tab ? "active" : ""}`}
          >
            [{tab}]
          </button>
        ))}
      </div>

      {/* Left Sidebar */}
      <div className="layout-left">
        <SidebarLeft activeTool={activeTool} setActiveTool={setActiveTool} />
      </div>

      {/* Center Content */}
      <div className="layout-center">
        {activeTab === "Terminal" ? (
          <>
            <TerminalWindow />
            <div className="query-output-wrapper">
              {renderToolPanel()}
            </div>
          </>
        ) : (
          <div className="tab-placeholder">[{activeTab} tab coming soon]</div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="layout-right">
        <SidebarRight />
      </div>

      {/* Bottom Footer */}
      <div className="layout-bottom">
        <KeyboardOverlay />
      </div>
    </div>
  );
};

export default TerminalLayout;
