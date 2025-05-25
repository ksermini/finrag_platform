import React from "react";

const BentoCard = ({ title, children, className = "" }) => {
  return (
    <div className={`panel-box ${className}`}>
      <h3 className="panel-box-title">{title}</h3>
      <div className="panel-box-content">{children}</div>
    </div>
  );
};

export default BentoCard;
