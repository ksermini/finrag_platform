import React from "react";
import BentoGrid from "../Bento/BentoGrid";
import BentoCard from "../Bento/BentoCard";

const LogsTab = () => (
  <BentoGrid>
    <BentoCard title="Recent Logs">Last system check: 12:01 PM</BentoCard>
    <BentoCard title="Alert History">3 errors in last 24h</BentoCard>
    <BentoCard title="Recovery Actions">Auto-restart: success</BentoCard>
  </BentoGrid>
);

export default LogsTab;
