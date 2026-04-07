import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../ContextApi/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Wait for auth health check
  if (loading) return null; // or loader

  // 🔐 Not logged in → go to login
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // 🚫 Role not allowed → unauthorized
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;
