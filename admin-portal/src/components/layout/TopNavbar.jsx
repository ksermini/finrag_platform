import React from "react";
import { useSidebar } from "../../context/SidebarContext";
import { Menu, X } from "lucide-react";

const TopNavbar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="flex justify-between items-center px-4 py-2 border-b border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-fg)]">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="p-1 hover:text-[var(--theme-accent)]">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <span className="font-semibold">FinRAG Admin Portal v1.0</span>
      </div>
    </div>
  );
};

export default TopNavbar;
