import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle"
import { Sparkles } from "@/components/ui/sparkles"
import { useTheme } from "@/context/ThemeContext"
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  User, 
  Settings, 
  LogOut, 
  Mail, 
  Key, 
  Shield, 
  CreditCard,
  ChevronDown
} from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

export function Navbar() {
  const { theme } = useTheme()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Enhanced debugging
  React.useEffect(() => {
    console.log("Navbar render - Auth user:", user);
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleProfileClick = () => {
    console.log("Profile clicked");
    navigate("/profile")
  }

  const handleSecurityClick = () => {
    console.log("Security clicked");
    navigate("/security")
  }

  const handleEmailClick = () => {
    console.log("Email preferences clicked");
    navigate("/email-preferences")
  }

  const handlePasswordClick = () => {
    console.log("Change password clicked");
    navigate("/change-password")
  }

  const handlePaymentClick = () => {
    console.log("Payment methods clicked");
    navigate("/payment-methods")
  }

  const handleMenuOpenChange = (open: boolean) => {
    console.log("Dropdown menu state:", open ? "open" : "closed");
    setIsMenuOpen(open);
  };

  // Used for manually opening menu for testing
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="relative flex items-center">
          <span className="text-lg font-semibold">Expense Empower</span>
          <div className="absolute -inset-1">
            <Sparkles 
              color={theme === "dark" ? "#8350e8" : "#8350e8"}
              size={2}
              density={50}
              speed={0.5}
              opacity={0.3}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          
          {/* Ensure we have a user object with email */}
          {user && user.email ? (
            <DropdownMenu open={isMenuOpen} onOpenChange={handleMenuOpenChange}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="relative flex items-center gap-2 px-3 py-2 h-9 rounded-full border border-primary/20 hover:bg-primary/10 cursor-pointer"
                  onClick={() => console.log("DropdownMenuTrigger clicked")}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.photoURL || user.user_metadata?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-sm">
                      {user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block">
                    {user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-50" sideOffset={5}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Information</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEmailClick} className="cursor-pointer">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePasswordClick} className="cursor-pointer">
                  <Key className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSecurityClick} className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Security Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePaymentClick} className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Payment Methods</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/login")} size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

Navbar.displayName = "Navbar"
