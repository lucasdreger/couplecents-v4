
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingOverlay } from "../ui/loading-overlay";

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PrivateRoute({ 
  children, 
  redirectTo = "/login" 
}: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingOverlay isLoading={true} text="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
