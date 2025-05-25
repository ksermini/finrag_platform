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

        {/* 👇 Use a full flex column layout for the chat area */}
        <div className="dashboard-chat-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
