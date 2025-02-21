import { NavLink } from "react-router-dom"

const links = [
  { href: "/", label: "Overview" },
  { href: "/expenses", label: "Expenses" },
  { href: "/fixed-expenses", label: "Fixed Expenses" },
  { href: "/income", label: "Income" },
  { href: "/investments", label: "Investments" },
  { href: "/admin", label: "Administration" },
]

export function MainNav() {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {links.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) =>
            `text-sm font-medium transition-colors hover:text-primary ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
