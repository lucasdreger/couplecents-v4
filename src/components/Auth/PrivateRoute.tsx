import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function PrivateRoute() {
  const { user, loading, isInitialized } = useAuth();
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Force content to show after a timeout
  useEffect(() => {
    // Immediately show content if we know the user
    if (user) {
      setShowContent(true);
      return;
    }

    // Short timeout for initial loading
    const initialTimer = setTimeout(() => {
      // If still loading, show loading screen
      if (loading && !user) {
        console.log("PrivateRoute: Still initializing auth...");
      } else if (!loading && !user) {
        // If not loading and no user, redirect to login (handled in render)
        console.log("PrivateRoute: No user detected, prepare for redirect");
      } else {
        // Otherwise show content
        setShowContent(true);
      }
    }, 1000);

    // Safety timeout - show something no matter what after 5 seconds
    const safetyTimer = setTimeout(() => {
      if (!showContent) {
        console.log("PrivateRoute: Safety timeout reached, showing fallback");
        setShowFallback(true);
      }
    }, 5000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(safetyTimer);
    };
  }, [user, loading, showContent, isInitialized]);

  // Log auth state for debugging
  useEffect(() => {
    console.log("PrivateRoute: auth state =", {
      user: user?.email,
      loading,
      isInitialized,
      pathname: location.pathname,
      showContent
    });
  }, [user, loading, isInitialized, location.pathname, showContent]);

  // If still initializing, show loading state
  if (loading && !showFallback) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Safety fallback - show this if auth fails to initialize properly
  if (showFallback && !showContent) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">Welcome to CoupleCents</h1>
          <p className="mb-6 text-muted-foreground">
            It looks like we're having trouble checking your login status. Please sign in to continue.
          </p>
          <div className="flex gap-4">
            <a 
              href="/login"
              className="flex-1 rounded-md bg-primary px-4 py-2 text-center font-medium text-primary-foreground"
            >
              Sign In
            </a>
            <button 
              onClick={() => window.location.reload()}
              className="rounded-md border border-border bg-background px-4 py-2 font-medium"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show outlet if user is authenticated or we're allowing content to show
  if (user || showContent) {
    return <Outlet />;
  }
  
  // If no user and not loading, redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
}
