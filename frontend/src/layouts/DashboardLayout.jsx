
import React from "react";
import GlassIcons from "../reactbits/glass/GlassIcons";
import "../styles/DashboardLayout.css";

const DashboardLayout = ({ sidebarItems, children, topbar }) => {
  return (
    <div className="dashboard-wrapper">
      <aside className="dashboard-sidebar">
        <GlassIcons items={sidebarItems} />
      </aside>

      <div className="dashboard-content">
        {topbar && <div className="dashboard-topbar">{topbar}</div>}
        <main className="dashboard-main-grid">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
