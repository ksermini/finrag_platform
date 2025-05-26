import React, { useState, useEffect } from "react";
import LayoutWrapper from "./LayoutWrapper";
import PanelBox from "../shared/PanelBox";

import TerminalWindow from "../shared/TerminalWindow";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import UsersTab from "../tabs/UsersTab";

import VectorExplorer from "../tools/VectorExplorer";
import ModelStatus from "../tools/ModelStatus";
import AuditViewer from "../tools/AuditViewer";
import ChromaIndex from "../tools/ChromaIndex";
import APILogs from "../tools/APILogs";

const TOOLS = [
  { name: "Vector Explorer", component: <VectorExplorer /> },
  { name: "Model Status", component: <ModelStatus /> },
  { name: "Audit Viewer", component: <AuditViewer /> },
  { name: "Chroma Index", component: <ChromaIndex /> },
  { name: "API Logs", component: <APILogs /> },
];

const TerminalLayout = () => {
  const [activeTab, setActiveTab] = useState("Terminal");
  const [activeTool, setActiveTool] = useState(TOOLS[0].name);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const renderToolPanel = () => {
    const tool = TOOLS.find((t) => t.name === activeTool);
    return tool?.component ?? <div className="text-theme-muted text-sm">Select a tool</div>;
  };

  const renderCenterContent = () => {
    if (activeTab === "Terminal") {
      return (
        <PanelBox title="🖥 Terminal Output">
          <div className="terminal-window h-72 overflow-y-auto bg-[var(--theme-surface-muted)] p-4 rounded">
            <TerminalWindow />
          </div>
        </PanelBox>
      );
    }
  
    if (activeTab === "Tools") {
      return (
        <PanelBox title="Tool Panel">
          <div className="flex flex-wrap gap-2 mb-4">
            {TOOLS.map(({ name }) => (
              <button
                key={name}
                onClick={() => setActiveTool(name)}
                className={`px-4 py-1.5 rounded text-sm font-medium transition ${
                  activeTool === name
                    ? "bg-[var(--theme-surface-muted)] text-white border border-[var(--theme-border)]"
                    : "bg-transparent text-[var(--theme-muted)] hover:bg-[var(--theme-surface-muted)]"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="text-sm text-theme-fg">{renderToolPanel()}</div>
        </PanelBox>
      );
    }
  
    if (activeTab === "Users") return <UsersTab />;
    return <div className="text-theme-muted text-sm mt-10">[{activeTab} tab coming soon]</div>;
  };
  
  return (
    <LayoutWrapper
      left={<SidebarLeft activeTab={activeTab} onTabClick={setActiveTab} />}
      center={renderCenterContent()}
      right={<SidebarRight />}
      bottom={null}
      activeTab={activeTab}
      onTabClick={setActiveTab}
      clock={clock}
    />
  );
};

export default TerminalLayout;
