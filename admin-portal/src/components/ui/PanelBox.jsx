import React from "react";

const PanelBox = ({ title, children, className = "" }) => {
  return (
    <div className={`panel-box ${className}`} augmented-ui="tl-clip br-clip border">
      {title && <div className="panel-box-title">{title}</div>}
      <div className="panel-box-content">{children}</div>
    </div>
  );
};

export default PanelBox;
