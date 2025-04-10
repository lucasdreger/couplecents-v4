import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function PrivateRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isCustomDomain = window.location.hostname === 'couplecents.lucasdreger.com';

  // Log auth state for debugging
  useEffect(() => {
    console.log("PrivateRoute: user =", user?.email, "loading =", loading);
    console.log("PrivateRoute: isCustomDomain =", isCustomDomain);
  }, [user, loading, isCustomDomain]);

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

  // Show actual content if user is authenticated
  if (user) {
    console.log("PrivateRoute: User authenticated, rendering protected route");
    return <Outlet />;
  }
  
  // If no user, redirect to login page
  console.log("PrivateRoute: No user, redirecting to login");
  return <Navigate to="/login" state={{ from: location }} replace />;
}
