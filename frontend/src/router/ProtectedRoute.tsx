import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
<<<<<<< Updated upstream
        to="auth/login"
=======
        to="/auth/login"
>>>>>>> Stashed changes
      />
    );
  }

  return <Outlet />;
}
