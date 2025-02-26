import * as React from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, LogOut, Receipt, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

type IconType = typeof LayoutDashboard

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Investments', href: '/investments', icon: Wallet },
]

export const Sidebar = () => {
  const { signOut } = useAuth()

  return (
    <div className="w-64 border-r bg-muted/10 flex flex-col">
      <nav className="flex flex-col gap-2 p-4 flex-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }: { isActive: boolean }) =>
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
      <div className="p-4 border-t">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 text-red-600 hover:text-red-700"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
