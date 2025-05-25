import React from "react";
// import ThemeToggle from "../ui/ThemeToggle";

const LayoutWrapper = ({
  left,
  center,
  right,
  bottom,
  activeTab,
  onTabClick,
  clock,
}) => {
  const tabs = ["Terminal", "Users", "Jobs", "Logs", "Settings"];

  return (
    <div className="layout-wrapper">
      {/* Header */}
      <div className="layout-header">
        <span className="layout-header-title">FinRAG Admin Portal v1.0</span>
        <div className="flex items-center gap-3">
          <span className="layout-header-clock">
            {clock.toLocaleTimeString("en-GB", { hour12: false })}
          </span>
          {/* <ThemeToggle /> 🔁 Add toggle here */}
        </div>
      </div>

      {/* Tabs */}
      <div className="layout-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabClick(tab)}
            className={`layout-tab-btn ${activeTab === tab ? "active" : ""}`}
          >
            [{tab}]
          </button>
        ))}
      </div>

      <div className="layout-left">{left}</div>
      <div className="layout-center">{center}</div>
      <div className="layout-right">{right}</div>
      <div className="layout-bottom">{bottom}</div>
    </div>
  );
};

export default LayoutWrapper;
