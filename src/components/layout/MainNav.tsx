
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Monthly Expenses", href: "/monthly-expenses" },
  { name: "Analytics", href: "/analytics" },
  { name: "Administration", href: "/administration" },
];

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const location = useLocation();
  
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            location.pathname === item.href
              ? "text-foreground font-semibold"
              : "text-muted-foreground"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

export default MainNav;
