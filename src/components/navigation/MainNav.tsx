
import React from 'react'
import { NavLink } from "react-router-dom"
import {
  BarChart3,
  Calendar,
  PieChart,
  Settings
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const items: NavItem[] = [
  {
    title: "Overview",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "Monthly Details",
    href: "/monthly-expenses",
    icon: Calendar,
  },
  {
    title: "Financial Analytics",
    href: "/analytics",
    icon: PieChart,
  },
  {
    title: "Administration",
    href: "/administration",
    icon: Settings,
  },
]

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={className} {...props}>
      <div className="relative">
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                isActive ? "bg-accent" : "transparent"
              }`
            }
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
