import React, { useState } from "react";
import TerminalWindow from "./TerminalWindow";
import QueryOutput from "./QueryOutput";
import KeyboardOverlay from "./KeyboardOverlay";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import UsersTab from "./tabs/UsersTab";
import Scanlines from "./Scanlines";

const tabs = ["Terminal", "Users", "Jobs", "Logs", "Settings"];

const TerminalLayout = () => {
  const [activeTab, setActiveTab] = useState("Terminal");

  const renderMainContent = () => {
    switch (activeTab) {
      case "Terminal":
        return (
          <>
            <TerminalWindow />
            <QueryOutput />
          </>
        );
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
      <SidebarLeft />

      {/* Main Terminal Panel */}
      <div
        className="col-span-8 p-4 overflow-y-auto augmented-panel"
        augmented-ui="border tl-clip tr-clip br-clip bl-clip"
      >
        {renderMainContent()}
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
