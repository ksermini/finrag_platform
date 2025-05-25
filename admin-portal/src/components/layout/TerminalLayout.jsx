import React, { useState, useEffect } from "react";
import LayoutWrapper from "./LayoutWrapper";
import TerminalWindow from "../shared/TerminalWindow";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import KeyboardOverlay from "../tools/KeyboardOverlay";
import UsersTab from "../tabs/UsersTab";

// Tool Panels
import VectorExplorer from "../tools/VectorExplorer";
import ModelStatus from "../tools/ModelStatus";
import AuditViewer from "../tools/AuditViewer";
import ChromaIndex from "../tools/ChromaIndex";
import APILogs from "../tools/APILogs";

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
    <LayoutWrapper
      left={<SidebarLeft activeTool={activeTool} setActiveTool={setActiveTool} />}
      center={
        activeTab === "Terminal" ? (
          <>
            <TerminalWindow />
            <div className="query-output-wrapper">{renderToolPanel()}</div>
          </>
        ) : activeTab === "Users" ? (
          <UsersTab />
        ) : (
          <div className="tab-placeholder">[{activeTab} tab coming soon]</div>
        )
      }
      right={<SidebarRight />}
      bottom={<KeyboardOverlay />}
      activeTab={activeTab}
      onTabClick={setActiveTab}
      clock={clock}
    />
  );
};

export default TerminalLayout;
