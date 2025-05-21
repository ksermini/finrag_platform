import AdminDashboard from "../components/Dashboard/AdminDashboard";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

export default function Admin() {
  return (
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
