import React from "react";

const LayoutWrapper = ({ left, center, right, bottom }) => {
  return (
    <div className="layout-wrapper">
      {/* Top Header Bar */}
      <div className="layout-header">
        <span className="layout-header-title">FinRAG System Console v1.0</span>
        <span className="layout-header-clock">{new Date().toUTCString()}</span>
      </div>

      {/* Tabs Row */}
      <div className="layout-tabs">
        {["Terminal", "Users", "Jobs", "Logs", "Settings"].map((tab) => (
          <button key={tab} className="layout-tab-btn">
            [{tab}]
          </button>
        ))}
      </div>

      {/* Left Sidebar */}
      <div className="layout-left">{left}</div>

      {/* Main Center Panel */}
      <div className="layout-center">{center}</div>

      {/* Right Sidebar */}
      <div className="layout-right">{right}</div>

      {/* Bottom Bar */}
      <div className="layout-bottom">{bottom}</div>
    </div>
  );
};

export default LayoutWrapper;
