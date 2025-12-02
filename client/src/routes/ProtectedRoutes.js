import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoutes = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    window.catalyst.auth
      .isUserAuthenticated()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};
