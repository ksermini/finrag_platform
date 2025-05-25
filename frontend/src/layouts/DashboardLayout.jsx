import React from "react";
import GlassIcons from "../reactbits/glass/GlassIcons";
import "../styles/DashboardLayout.css";

const DashboardLayout = ({ sidebarItems, children, banner }) => {
  return (
    <div className="dashboard-root">
      <header className="dashboard-banner">{banner}</header>

      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          <GlassIcons items={sidebarItems} />
        </aside>

        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
