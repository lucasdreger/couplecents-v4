import { Link } from "react-router-dom"

const links = [
  { to: "/", label: "Overview" },
  { to: "/expenses", label: "Monthly Expenses" },
  { to: "/admin", label: "Administration" },
]

export function MainNav() {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
