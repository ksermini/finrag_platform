// PanelBox.jsx
import React from "react";

const PanelBox = ({ title, children, className = "" }) => {
  return (
    <div
      className={`p-3 bg-[#101a1a] border border-cyan-400 rounded-md shadow shadow-cyan-500/20 text-xs text-cyan-100 font-mono augmented-panel ${className}`}
      augmented-ui="tl-clip br-clip border"
    >
      {title && (
        <div className="mb-2 font-bold glow-text text-cyan-300 border-b border-cyan-700 pb-1">
          {title}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default PanelBox;
