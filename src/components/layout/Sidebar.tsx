import { NavLink } from "react-router-dom";
import {
  BarChart4, 
  CreditCard, 
  DollarSign, 
  LayoutDashboard, 
  LogOut, 
  Receipt, 
  Settings, 
  PiggyBank,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

type IconType = typeof LayoutDashboard;

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Investments', href: '/investments', icon: BarChart4 },
  { name: 'Reserves', href: '/reserves', icon: PiggyBank },
  { name: 'Administration', href: '/administration', icon: Settings },
];

export default function Sidebar() {
  const { signOut } = useAuth();
  
  return (
    <div className="hidden w-64 flex-shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-sidebar-primary" />
          <span className="font-bold">Expense Empower</span>
        </div>
      </div>
      
      {/* Application title */}
      <div className="border-b border-sidebar-border px-4 py-3">
        <p className="font-medium">Financial Dashboard</p>
        <p className="text-xs opacity-70">Personal Finance</p>
      </div>
      
      {/* Navigation links */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Sign out button */}
      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-red-400 transition-colors hover:bg-red-500/20"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
