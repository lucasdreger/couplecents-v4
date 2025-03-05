import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { useAuth } from '@/context/AuthContext'
import { 
  LayoutDashboard, 
  BarChart3, 
  Receipt, 
  Settings
} from "lucide-react"

// Import the new sidebar components
import { 
  Sidebar as SidebarContainer, 
  SidebarBody, 
  SidebarLink 
} from "@/components/ui/sidebar"

export function Sidebar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  // Define navigation links - removed Income, Investments, and Reserves
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Monthly Expenses",
      href: "/monthly-expenses",
      icon: <Receipt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Financial Analytics",
      href: "/analytics",
      icon: <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Administration",
      href: "/administration",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
  ]

  return (
    <SidebarContainer open={open} setOpen={setOpen} animate={true}>
      <SidebarBody className="justify-between gap-10 border-r border-border h-full">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? (
            <Logo />
          ) : (
            <LogoIcon />
          )}
          
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink 
                key={idx} 
                link={link}
                className={location.pathname === link.href ? "text-primary font-medium" : ""} 
              />
            ))}
          </div>
        </div>
        
        {user && (
          <div>
            <SidebarLink
              link={{
                label: user.email ? user.email.split('@')[0] : "User",
                href: "/profile",
                icon: (
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarImage src={user.photoURL || user.user_metadata?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10">
                      {user.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                ),
              }}
            />
          </div>
        )}
      </SidebarBody>
    </SidebarContainer>
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