import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  const location = useLocation();

  // ❌ Not logged in → redirect to login + remember route
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}   // 👈 KEY FIX
      />
    );
  }

  // ❌ Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
