import { useEffect, useState } from "react";
import api from "../../api/client";

export default function MetricsCard() {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    api.get("/admin/system-metrics", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setMetrics(res.data));
  }, []);

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="font-semibold mb-2">System Metrics</h2>
      <p>Queries (24h): {metrics.query_count}</p>
      <p>Avg Latency: {metrics.avg_latency} ms</p>
      <p>Avg Tokens: {metrics.avg_tokens}</p>
    </div>
  );
}
