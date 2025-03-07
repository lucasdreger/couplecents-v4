import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from "framer-motion"
import { useAuth } from '@/context/AuthContext'
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  LineChart,
  Wallet,
  Settings,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const routes = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    title: "Monthly Expenses",
    icon: Wallet,
    href: "/expenses",
    color: "text-violet-500",
  },
  {
    title: "Analytics",
    icon: LineChart,
    href: "/analytics",
    color: "text-orange-500",
  },
  {
    title: "Administration",
    icon: Settings,
    href: "/administration",
    color: "text-gray-500",
  },
]

export function Sidebar() {
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div 
      className={cn(
        "w-[300px] h-full flex flex-col justify-between py-4 bg-background border-r transition-all duration-300",
        !open && "w-[60px]"
      )}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="px-3 py-2">
        {open ? <Logo /> : <LogoIcon />}
        
        <nav className="space-y-2 mt-8">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === route.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <route.icon className={cn("h-5 w-5 mr-2", route.color)} />
              {open && <span>{route.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {user && (
        <div className="px-3 py-2">
          <div
            className={cn(
              "flex items-center px-2 py-2 text-sm font-medium rounded-md text-muted-foreground",
              open && "justify-between"
            )}
          >
            <div className="flex items-center">
              <Avatar className="h-7 w-7 mr-2">
                <AvatarImage src={user.avatar_url} alt={user.email || 'User'} />
                <AvatarFallback>
                  {user.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              {open && (
                <span className="text-sm font-medium">
                  {user.email?.split('@')[0]}
                </span>
              )}
            </div>
            {open && (
              <button
                onClick={handleSignOut}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Logo component for expanded sidebar
const Logo = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20">
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-neutral-900 dark:text-neutral-100"
      >
        CoupleCents
      </motion.span>
    </div>
  )
}

// Logo icon for collapsed sidebar
const LogoIcon = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20">
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </div>
  )
}
