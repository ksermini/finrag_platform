import React from "react";

const LayoutWrapper = ({
  left,
  center,
  right,
  bottom,
  activeTab,
  onTabClick,
  clock,
}) => {
  const tabs = ["Terminal", "Users", "Jobs", "Logs", "Settings"];

  return (
    <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[64px_1fr_40px] h-screen w-screen text-white bg-[var(--theme-bg)] font-sans">
      
      {/* HEADER */}
      <header className="col-span-3 row-start-1 flex items-center justify-between px-6 bg-[var(--theme-elevated)] shadow-md">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold tracking-wide">FinRAG Admin Portal v1.0</span>
        </div>
        <span className="text-[var(--theme-accent)] font-mono">
          {clock.toLocaleTimeString("en-GB", { hour12: false })}
        </span>
      </header>

      {/* SIDEBAR LEFT */}
      <aside className="row-span-2 overflow-y-auto shadow-inner bg-[var(--theme-elevated)]">
        {left}
      </aside>

      {/* CENTER MAIN */}
      <main className="overflow-y-auto px-8 py-6 bg-gradient-to-b from-black via-[#0e0e18] to-black">
        {center}
      </main>

      {/* SIDEBAR RIGHT */}
      <aside className="row-span-2 overflow-y-auto shadow-inner bg-[var(--theme-elevated)]">
        {right}
      </aside>

      {/* FOOTER */}
      <footer className="col-span-3 flex items-center justify-center text-sm text-[var(--theme-accent-muted)] bg-[var(--theme-elevated)] shadow-inner">
        {bottom}
      </footer>
    </div>
  );
};

export default LayoutWrapper;
