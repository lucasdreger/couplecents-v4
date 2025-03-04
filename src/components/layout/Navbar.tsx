import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun, 
  LogOut, 
  User,
  Settings,
  Key,
  UserCircle
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sparkles } from "@/components/ui/sparkles";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    toast.info("Profile feature coming soon");
  };

  const handleChangePasswordClick = () => {
    navigate("/change-password");
    toast.info("Password change feature coming soon");
  };

  const handleAccountSettings = () => {
    navigate("/account-settings");
    toast.info("Account settings feature coming soon");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full hover:bg-secondary/70 transition-colors duration-300 cursor-pointer">
                  <UserCircle className="h-4 w-4" />
                  <span className="text-sm">{user.email?.split('@')[0] || 'User'}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Information</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleChangePasswordClick}>
                  <Key className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAccountSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
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
    </header>
  );
}

Navbar.displayName = "Navbar";
