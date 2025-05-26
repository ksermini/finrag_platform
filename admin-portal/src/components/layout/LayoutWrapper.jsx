import React from "react";

const LayoutWrapper = ({
  left,
  center,
  right,
  bottom,
  activeTab,
  onTabClick,
  clock,
}) => {
  return (
    <div className="layout-wrapper">
      {/* Header */}
      <header className="layout-header">
        <span className="text-sm font-semibold tracking-wide">FinRAG Admin Portal</span>
        <span className="clock-display">
          {clock.toLocaleTimeString("en-GB", { hour12: false })}
        </span>
      </header>

      {/* Left Sidebar */}
      <aside className="layout-left">
        {left}
      </aside>

      {/* Center Content */}
      <main className="layout-center">
        {center}
      </main>

      {/* Right Sidebar */}
      <aside className="layout-right">
        {right}
      </aside>

      {/* Footer */}
      <footer className="layout-bottom">
        {bottom || "© FinRAG 2025"}
      </footer>
    </div>
  );
};

export default LayoutWrapper;
