import React from "react";
import {
  Terminal,
  Users,
  Briefcase,
  ScrollText,
  Settings,
} from "lucide-react";

const icons = {
  Terminal: Terminal,
  Users: Users,
  Jobs: Briefcase,
  Logs: ScrollText,
  Settings: Settings,
};

const SidebarLeft = ({ activeTab, onTabClick }) => {
  const tabs = Object.keys(icons);

  return (
    <div className="flex flex-col items-center gap-4 bg-[var(--theme-elevated)] border-r border-[var(--theme-border)] p-3 rounded-r-2xl shadow-sm backdrop-blur h-full">
      {tabs.map((tab) => {
        const Icon = icons[tab];
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => onTabClick(tab)}
            title={tab}
            className={`p-2 rounded-xl transition-all duration-150 ${
              isActive
                ? "bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]"
                : "text-[var(--theme-muted)] hover:text-[var(--theme-fg)]"
            }`}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
};

export default SidebarLeft;
