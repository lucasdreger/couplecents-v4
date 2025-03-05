
import { NavLink } from "react-router-dom";
import { LayoutDashboard, LogOut, Settings, Wallet, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Sparkles } from "@/components/ui/sparkles";

const sidebarLinks = [{
  title: "Overview",
  href: "/",
  icon: LayoutDashboard
}, {
  title: "Monthly Expenses",
  href: "/monthly-expenses",
  icon: Wallet
}, {
  title: "Financial Analytics",
  href: "/analytics",
  icon: LineChart
}, {
  title: "Administration",
  href: "/administration",
  icon: Settings
}];

export default function Sidebar() {
  const { signOut } = useAuth();
  const { theme } = useTheme();
  
  return (
    <div className="hidden w-64 flex-shrink-0 flex-col border-r border-border bg-background text-foreground md:flex relative overflow-hidden">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">CoupleCents Financial</span>
        </div>
      </div>
      
      {/* Application title */}
      <div className="border-b border-border px-4 py-3 relative z-10">
        <p className="font-medium bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Financial Dashboard</p>
        <p className="text-xs text-muted-foreground">Personal Finance</p>
      </div>
      
      {/* Navigation links */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4 relative z-10">
        {sidebarLinks.map((item) => (
          <NavLink
            key={item.title}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-colors group",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary font-medium"
                  : "hover:bg-accent/50 hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 group-hover:text-purple-500 transition-colors" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Sign out button */}
      <div className="border-t border-border p-4 relative z-10">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Background sparkles */}
      <div className="absolute inset-0 z-0 opacity-5">
        <Sparkles 
          className="h-full w-full" 
          color={theme === "dark" ? "var(--sparkles-color)" : "#8350e8"} 
          size={1} 
          density={100} 
          speed={0.2} 
        />
      </div>
    </div>
  );
}
