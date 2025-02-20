
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, PiggyBank, BarChart3, Settings } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar>
          <SidebarContent>
            <nav className="space-y-2 py-4">
              <a href="/" className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
                <Home className="h-5 w-5 mr-3" />
                Overview
              </a>
              <a href="/transactions" className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-muted">
                <PiggyBank className="h-5 w-5 mr-3" />
                Transactions
              </a>
              <a href="/analytics" className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-muted">
                <BarChart3 className="h-5 w-5 mr-3" />
                Analytics
              </a>
              <a href="/settings" className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-muted">
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </a>
            </nav>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <SidebarTrigger className="mb-6" />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
