import React, { useState, useEffect } from "react";
import LayoutWrapper from "./LayoutWrapper";

import TerminalWindow from "../shared/TerminalWindow";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import KeyboardOverlay from "../tools/KeyboardOverlay";
import UsersTab from "../tabs/UsersTab";

// Tools
import VectorExplorer from "../tools/VectorExplorer";
import ModelStatus from "../tools/ModelStatus";
import AuditViewer from "../tools/AuditViewer";
import ChromaIndex from "../tools/ChromaIndex";
import APILogs from "../tools/APILogs";

const TerminalLayout = () => {
  const [activeTab, setActiveTab] = useState("Terminal");
  const [activeTool, setActiveTool] = useState("Vector Explorer");
  const [clock, setClock] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);



  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev); // ⬅️ added


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
        return <div className="text-muted text-sm">Select a tool</div>;
    }
  };

  const renderCenterContent = () => {
    if (activeTab === "Terminal") {
      return (
        <>
          {/* Terminal Output Bento */}
          <div className="rounded-xl p-5 bg-gradient-to-br from-[#13131a] to-[#0f0f17] border border-white/10 shadow-lg">
            <div className="text-lg font-semibold mb-2 text-white/90">🖥️ Terminal Output</div>
            <div className="h-[300px] overflow-y-auto font-mono text-sm text-blue-200">
              <TerminalWindow />
            </div>
          </div>

          {/* Tool Viewer Bento */}
          <div className="rounded-xl p-5 bg-gradient-to-br from-[#14141f] to-[#0d0d16] border border-white/10 shadow-lg">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold text-white/90">🧩 Tool Panel</div>
              </div>

              {/* Pills navigation */}
              <div className="flex flex-wrap gap-2">
                {["Vector Explorer", "Model Status", "Audit Viewer", "Chroma Index", "API Logs"].map(
                  (tool) => (
                    <button
                      key={tool}
                      onClick={() => setActiveTool(tool)}
                      className={`px-4 py-1.5 text-sm rounded-full transition font-medium ${
                        activeTool === tool
                          ? "bg-blue-500 text-white shadow"
                          : "bg-white/10 text-white/60 hover:bg-white/20"
                      }`}
                    >
                      {tool}
                    </button>
                  )
                )}
              </div>

              {/* Active Tool Output */}
              <div className="text-sm text-white/80 pt-2">{renderToolPanel()}</div>
            </div>
          </div>
        </>
      );
    }

    if (activeTab === "Users") return <UsersTab />;

    return <div className="text-muted text-sm mt-10">[{activeTab} tab coming soon]</div>;
  };

  return (
    <LayoutWrapper
      left={
        <SidebarLeft
          activeTab={activeTab}
          onTabClick={setActiveTab}
          isOpen={isSidebarOpen}
        />
      }
      center={
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold text-lg">FinRAG Admin Portal v1.0</h2>
            <button
              onClick={toggleSidebar}
              className="text-sm px-3 py-1 rounded bg-white/10 text-white hover:bg-white/20 transition"
            >
              {isSidebarOpen ? "Hide Panel" : "Show Panel"}
            </button>
          </div>
          {renderCenterContent()}
        </div>
      }
      right={<SidebarRight />}
      activeTab={activeTab}
      onTabClick={setActiveTab}
      clock={clock}
    />


  );
};

export default TerminalLayout;
