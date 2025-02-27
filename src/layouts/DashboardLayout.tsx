import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout() {
  const { user, loading: authLoading } = useAuth();
  
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg text-muted-foreground">Loading your data...</p>
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
