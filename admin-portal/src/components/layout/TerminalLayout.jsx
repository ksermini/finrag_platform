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
    return tool?.component ?? <div className="text-muted text-sm">Select a tool</div>;
  };

  const renderCenterContent = () => {
    if (activeTab === "Terminal") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Terminal Output */}
          <PanelBox title="🖥️ Terminal Output" variant="bento">
            <div className="h-72 overflow-y-auto text-[13px] text-blue-300 bg-black/20 rounded-lg p-4">
              <TerminalWindow />
            </div>
          </PanelBox>

          {/* Tool Panel */}
          <PanelBox title="🧩 Tool Panel" variant="bento" gradient>
            <div className="flex flex-wrap gap-2 mb-4">
              {TOOLS.map(({ name }) => (
                <button
                  key={name}
                  onClick={() => setActiveTool(name)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    activeTool === name
                      ? "bg-[var(--theme-accent)] text-white shadow"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="text-sm text-white/80">{renderToolPanel()}</div>
          </PanelBox>
        </div>
      );
    }

    if (activeTab === "Users") return <UsersTab />;

    return <div className="text-muted text-sm mt-10">[{activeTab} tab coming soon]</div>;
  };

  return (
    <LayoutWrapper
      left={<SidebarLeft activeTab={activeTab} onTabClick={setActiveTab} />}
      center={renderCenterContent()}
      right={<SidebarRight />}
      activeTab={activeTab}
      onTabClick={setActiveTab}
      clock={clock}
    />
  );
};

export default TerminalLayout;
