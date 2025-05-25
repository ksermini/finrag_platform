import React from "react";

const SidebarLeft = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "logs", label: "Logs" },
    { key: "query", label: "Query" },
    { key: "metadata", label: "Metadata" }
  ];

  return (
    <div className="sidebar-left">
      <div className="sidebar-title">Sections</div>
      <div className="tool-list">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tool-card ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarLeft;
