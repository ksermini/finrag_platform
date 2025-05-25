import React from "react";
import BentoGrid from "../Bento/BentoGrid";
import BentoCard from "../Bento/BentoCard";

const MetadataTab = () => (
  <BentoGrid>
    <BentoCard title="Pipeline Stage">
      Last update: 3 min ago<br />
      ETL stage: Transform
    </BentoCard>
    <BentoCard title="Latency Stats">Avg: 142ms<br />P95: 221ms</BentoCard>
    <BentoCard title="System Load">Threads: 8<br />RAM: 72%</BentoCard>
  </BentoGrid>
);

export default MetadataTab;
