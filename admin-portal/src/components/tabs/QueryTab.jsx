import React from "react";
import BentoGrid from "../Bento/BentoGrid";
import BentoCard from "../Bento/BentoCard";
import PanelBox from "../PanelBox"; // optional

const QueryTab = () => (
  <PanelBox title="Query Metrics">
    <BentoGrid>
      <BentoCard title="Query Log Summary">43 queries today</BentoCard>
      <BentoCard title="Cached Queries">12 served from cache</BentoCard>
      <BentoCard title="RAG Usage">7 unique source types</BentoCard>
    </BentoGrid>
  </PanelBox>
);

export default QueryTab;
