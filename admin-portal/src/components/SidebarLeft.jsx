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
      <div className="tool-panel">
        {tools.map((tool) => (
          <button
            key={tool}
            className={`tool-button ${activeTool === tool ? "active" : ""}`}
            onClick={() => setActiveTool(tool)}
          >
            {tool}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarLeft;
