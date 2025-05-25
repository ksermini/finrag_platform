import React from "react";

const tools = [
  "Vector Explorer",
  "Model Status",
  "Audit Viewer",
  "Chroma Index",
  "API Logs",
];

const SidebarLeft = ({ activeTool, setActiveTool }) => {
  return (
    <div className="sidebar-left">
      <div className="sidebar-title">[ Tools ]</div>
      <div className="tool-list">
        {tools.map((tool) => (
          <button
            key={tool}
            onClick={() => setActiveTool(tool)}
            className={`tool-card ${activeTool === tool ? "active" : ""}`}
          >
            {tool}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarLeft;
