import React from "react";

const SidebarLeft = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "logs", label: "Logs" },
    { key: "query", label: "Query" },
    { key: "metadata", label: "Metadata" }
  ];

  return (
    <div className="tool-panel">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tool-button ${activeTab === tab.key ? "active" : ""}`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SidebarLeft;
