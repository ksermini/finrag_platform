import React from "react";
import {
  Terminal, Users, Briefcase, ScrollText, Settings,
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";

const icons = {
  Terminal,
  Users,
  Tools: Briefcase,
  Groups: ScrollText,
  Settings,
};

const SidebarLeft = ({ activeTab, onTabClick }) => {
  const { isSidebarOpen } = useSidebar();
  const tabs = Object.keys(icons);

  return (
    <aside
      className={`flex flex-col gap-2 py-4 px-2 transition-all duration-300 bg-[var(--theme-elevated)] h-full shadow-inner 
      ${isSidebarOpen ? "w-44 items-start px-4" : "w-14 items-center"}`}
    >
      {tabs.map((tab) => {
        const Icon = icons[tab];
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => onTabClick(tab)}
            title={!isSidebarOpen ? tab : ""}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition font-medium text-sm
              ${
                isActive
                  ? "bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]"
                  : "text-[var(--theme-muted)] hover:text-white hover:bg-white/10"
              }
            `}
          >
            <Icon size={20} />
            {isSidebarOpen && <span className="truncate">{tab}</span>}
          </button>
        );
      })}
    </aside>
  );
};

export default SidebarLeft;
