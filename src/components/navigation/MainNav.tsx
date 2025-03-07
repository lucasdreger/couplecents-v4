import { Link } from "react-router-dom"
import { LayoutDashboard, Wallet, LineChart, Banknote, TrendingUp, Vault, Settings } from "some-icon-library"

const mainNavItems = [
  {
    title: "Overview",
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
    title: "Income",
    href: "/income",
    icon: Banknote
  },
  {
    title: "Investments",
    href: "/investments",
    icon: TrendingUp
  },
  {
    title: "Reserves",
    href: "/reserves",
    icon: Vault
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
