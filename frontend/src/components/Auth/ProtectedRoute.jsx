import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("role");
  return userRole === role ? children : <Navigate to="/" />;
}
