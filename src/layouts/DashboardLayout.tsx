import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useHousehold } from '@/context/HouseholdContext';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout() {
  const { user, loading: authLoading } = useAuth();
  const { 
    currentHousehold, 
    loading: householdLoading, 
    households,
    error: householdError 
  } = useHousehold();
  const navigate = useNavigate();
  
  // Global loading state that accounts for both auth and household data
  const isLoading = authLoading || householdLoading;
  
  // Redirect to household creation if no households exist after loading
  useEffect(() => {
    if (!isLoading && user && households.length === 0) {
      navigate('/administration', { replace: true });
    }
  }, [user, isLoading, households, navigate]);

  // Show loading state while either auth or household data is loading
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  // Show error state if household data failed to load
  if (householdError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center max-w-md mx-auto p-6">
          <p className="text-lg text-destructive">Unable to load your household data</p>
          <p className="text-sm text-muted-foreground">{householdError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
