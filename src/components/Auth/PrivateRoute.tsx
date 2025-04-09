import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function PrivateRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Log auth state for debugging
  useEffect(() => {
    console.log("PrivateRoute: user =", user?.email, "loading =", loading);
  }, [user, loading]);

  if (loading) {
    console.log("PrivateRoute: Still loading...");
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  // TEMPORARY: For GitHub Pages debugging - allow access regardless of auth status
  console.log("PrivateRoute: TEMPORARY - Bypassing auth check for debugging");
  return <Outlet />;

  // Commented out for debugging
  /*
  if (!user) {
    console.log("PrivateRoute: No user, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("PrivateRoute: User authenticated, rendering protected route");
  return <Outlet />;
  */
}
