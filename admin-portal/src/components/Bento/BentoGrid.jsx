import React from "react";

const BentoGrid = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 max-w-screen-xl mx-auto">
      {children}
    </div>
  );
};

export default BentoGrid;
