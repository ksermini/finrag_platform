import React from "react";
import BentoGrid from "./Bento/BentoGrid";
import BentoCard from "./Bento/BentoCard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold p-6">FinRAG Admin Dashboard</h1>
      <BentoGrid>
        <BentoCard title="System Logs">
          <p>View live logs and pipeline events.</p>
        </BentoCard>
        <BentoCard title="Model Metrics">
          <p>Latency: 150ms<br/>Tokens Used: 543</p>
        </BentoCard>
        <BentoCard title="Error Reports">
          <p>Last failure: 7 mins ago</p>
        </BentoCard>
        <BentoCard title="Cached Queries">
          <p>32 queries served from cache</p>
        </BentoCard>
        <BentoCard title="Recent Uploads">
          <p>User uploaded SOP.pdf</p>
        </BentoCard>
        <BentoCard title="Feedback Summary">
          <p>96% accuracy reported</p>
        </BentoCard>
      </BentoGrid>
    </div>
  );
};

export default Dashboard;
