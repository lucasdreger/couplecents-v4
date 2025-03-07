import { Link } from "react-router-dom"
import { LayoutDashboard, Wallet, LineChart, Settings } from "lucide-react"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard
  },
  {
    title: "Monthly Expenses",
    href: "/expenses",
    icon: Wallet
  },
  {
    title: "Financial Analytics",
    href: "/analytics",
    icon: LineChart
  },
  {
    title: "Administration",
    href: "/admin",
    icon: Settings
  }
]

export function MainNav() {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {mainNavItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
