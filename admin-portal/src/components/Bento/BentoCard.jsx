import React from "react";

const BentoCard = ({ title, children, className = "" }) => {
  return (
    <div className={`rounded-2xl p-4 bg-[#0e0e0e] text-white shadow-lg border border-[#00ffff33] hover:scale-[1.02] transition-all ${className}`}>
      <h3 className="text-sm text-[#00ffffaa] font-mono mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default BentoCard;
