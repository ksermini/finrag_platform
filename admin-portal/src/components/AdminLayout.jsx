import React, { useState } from "react";
import SidebarLeft from "./SidebarLeft";
import LogsTab from "./tabs/LogsTab";
import QueryTab from "./tabs/QueryTab";
import MetadataTab from "./tabs/MetadataTab";
import SysinfoPanel from "./SysinfoPanel";
import CpuGraph from "./CpuGraph";

const TABS = {
  logs: <LogsTab />,
  query: <QueryTab />,
  metadata: <MetadataTab />
};

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState("logs");

  return (
    <div className="layout-wrapper">
      <div className="sidebar-left">
        <SidebarLeft activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="layout-center">
        {TABS[activeTab]}
      </div>

      <div className="layout-right">
        <div className="mb-4">
            <h3 className="text-xs text-[#00ffffaa] font-mono mb-1">System Info</h3>
            <SysinfoPanel />
        </div>
        <div>
            <h3 className="text-xs text-[#00ffffaa] font-mono mb-1">CPU Load</h3>
            <CpuGraph />
        </div>
        </div>
    </div>
  );
};

export default AdminLayout;
