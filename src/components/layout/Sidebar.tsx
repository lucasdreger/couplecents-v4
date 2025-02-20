import { NavLink } from "react-router-dom"
import { LayoutDashboard, Receipt, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Investments', href: '/investments', icon: Wallet },
]

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-muted/10">
      <nav className="flex flex-col gap-2 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50',
                isActive && 'bg-muted'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
