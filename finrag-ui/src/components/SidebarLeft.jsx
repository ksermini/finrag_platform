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
    <div className="col-span-2 border-r border-gray-600 p-2 text-[10px] space-y-2">
      <div className="text-gray-400 uppercase tracking-widest">[ Tools ]</div>
      {tools.map((tool) => (
        <div
          key={tool}
          onClick={() => setActiveTool(tool)}
          className={`cursor-pointer px-1 py-0.5 rounded 
            ${
              activeTool === tool
                ? "bg-gray-700 text-white font-semibold"
                : "hover:bg-gray-800 text-gray-300"
            }`}
        >
          • {tool}
        </div>
      ))}
    </div>
  );
};

export default SidebarLeft;
