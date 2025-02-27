import { Link } from "react-router-dom"

const navigationItems = [
  {
    name: "Dashboard",
    path: "/dashboard"
  },
  {
    name: "Expenses",
    path: "/expenses"
  },
  {
    name: "Fixed Expenses",
    path: "/fixed-expenses"
  },
  {
    name: "Income",
    path: "/income"
  },
  {
    name: "Investments",
    path: "/investments"
  },
  {
    name: "Reserves",
    path: "/reserves"
  },
  {
    name: "Administration",
    path: "/administration"
  }
]

export function MainNav() {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}
