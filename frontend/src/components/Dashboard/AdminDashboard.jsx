import MetricsCard from "./MetricsCard";
import QueryTable from "./QueryTable";
import { useEffect } from "react";

export default function AdminDashboard() {
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <MetricsCard />
      <QueryTable />
    </div>
  );
}
