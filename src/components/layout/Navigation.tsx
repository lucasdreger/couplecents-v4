import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  DollarSign, 
  Tags, 
  Wallet, 
  UserCircle 
} from 'lucide-react';

const Navigation = ({ isActive }: { isActive?: any }) => {
  const navItems = [
    { to: '/overview', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview' },
    { to: '/expenses', icon: <DollarSign className="w-5 h-5" />, label: 'Expenses' },
    { to: '/categories', icon: <Tags className="w-5 h-5" />, label: 'Categories' },
    { to: '/fixed-expenses', icon: <Wallet className="w-5 h-5" />, label: 'Fixed Expenses' },
    { to: '/profile', icon: <UserCircle className="w-5 h-5" />, label: 'Profile' },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-lg",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )
          }
        >
          {item.icon}
          <span className="ml-3">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
