import React from "react";
import {
  Terminal, Users, Briefcase, ScrollText, Settings,
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";

const icons = {
  Terminal,
  Users,
  Jobs: Briefcase,
  Logs: ScrollText,
  Settings,
};

const SidebarLeft = ({ activeTab, onTabClick }) => {
  const { isSidebarOpen } = useSidebar();
  const tabs = Object.keys(icons);

  return (
    <div
      className={`flex flex-col gap-3 bg-[var(--theme-elevated)] border-r border-[var(--theme-border)] 
      p-3 shadow-md h-full transition-all duration-300
      ${isSidebarOpen ? "w-40 items-start pl-4" : "w-14 items-center"}`}
    >
      {tabs.map((tab) => {
        const Icon = icons[tab];
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => onTabClick(tab)}
            title={!isSidebarOpen ? tab : ""}
            className={`flex items-center gap-3 px-2 py-2 w-full rounded-lg transition 
              ${isActive ? "bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]" : "text-[var(--theme-muted)] hover:text-[var(--theme-fg)]"}
            `}
          >
            <Icon size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">{tab}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default SidebarLeft;
