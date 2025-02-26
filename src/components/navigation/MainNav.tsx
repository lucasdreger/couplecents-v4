
import { Link } from "react-router-dom"

const navigationItems = [
  {
    name: "Overview",
    path: "/"
  },
  {
    name: "Expenses",
    path: "/expenses"
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
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}
