import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Sparkles } from "@/components/ui/sparkles";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Mail, Key, Shield, CreditCard, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Enhanced debugging
  React.useEffect(() => {
    console.log("Navbar render - Auth user:", user);
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNavigate = (path: string, label: string) => {
    console.log(`${label} clicked, navigating to ${path}`);
    setIsProfileOpen(false);
    navigate(path);
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="relative flex items-center">
          <span className="text-lg font-semibold">CoupleCents</span>
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
          {/* Replace ModeToggle with ThemeToggle */}
          <ThemeToggle />

          {/* Replace dropdown with sheet for more reliable mobile experience */}
          {user && user.email ? (
            <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="relative flex items-center gap-2 px-3 py-2 h-9 rounded-full border border-primary/20 hover:bg-primary/10 cursor-pointer bg-primary/5"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.user_metadata?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-sm">
                      {user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block">
                    {user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80" side="right">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center gap-4 pb-6 mb-6 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.user_metadata?.avatar_url || ''} />
                      <AvatarFallback className="bg-primary/10 text-base">
                        {user.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-medium">{user.email.split('@')[0]}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  {/* Navigation items */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Account Settings</h3>

                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigate("/profile", "Profile")}
                    >
                      <User className="mr-3 h-4 w-4" />
                      <span>Profile Information</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigate("/email-preferences", "Email Preferences")}
                    >
                      <Mail className="mr-3 h-4 w-4" />
                      <span>Email Preferences</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigate("/change-password", "Change Password")}
                    >
                      <Key className="mr-3 h-4 w-4" />
                      <span>Change Password</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigate("/security", "Security Settings")}
                    >
                      <Shield className="mr-3 h-4 w-4" />
                      <span>Security Settings</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigate("/payment-methods", "Payment Methods")}
                    >
                      <CreditCard className="mr-3 h-4 w-4" />
                      <span>Payment Methods</span>
                    </Button>
                  </div>

                  {/* Sign out button */}
                  <div className="mt-auto pt-6 border-t">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button onClick={() => navigate("/login")} size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

Navbar.displayName = "Navbar";