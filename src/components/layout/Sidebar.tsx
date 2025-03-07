import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, LayoutDashboard, Users, Wallet, Settings, HelpCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles } from '@/components/ui/sparkles';

interface SidebarProps {
  isOpen?: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Overview', href: '/overview', icon: LayoutDashboard },
    { name: 'Investments', href: '/investments', icon: Wallet },
    { name: 'Reserves', href: '/reserves', icon: Users },
  ];

  return (
    <div className="h-full pt-2 bg-sidebar">
      <div 
        className={cn(
          "group/sidebar flex flex-col h-full w-[60px] items-center px-2 py-2",
          isOpen && "w-64 items-start px-4"
        )}
      >
        <div className="mt-1 mb-4 flex h-10 w-full items-center justify-center">
          <Sparkles
            className="relative h-6 w-6 transform-gpu"
            color="var(--sparkles-color)"
            size={2}
            density={60}
            speed={0.5}
            opacity={0.3}
          />
        </div>
        <nav className="flex flex-col space-y-1 w-full">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-foreground/80 group-hover:text-foreground",
                  isOpen ? "justify-start" : "justify-center"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col w-full">
          <div className="border-t border-sidebar-border/40 my-2"></div>
          <div className="flex items-center justify-between px-2 py-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback className="bg-secondary">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{user?.email}</span>
                <button onClick={logout} className="text-xs text-muted-foreground hover:underline">
                  Log out
                </button>
              </div>
            )}
          </div>
          <div className="border-t border-sidebar-border/40 my-2"></div>
          <div className="flex flex-col space-y-1 w-full">
            <button
              onClick={toggleSettings}
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                isOpen ? "justify-start" : "justify-center"
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              {isOpen && <span>Settings</span>}
            </button>
            {isSettingsOpen && isOpen && (
              <div className="flex flex-col space-y-1 px-4">
                <div className="flex items-center justify-between rounded-md px-2 py-1">
                  <Label htmlFor="auto-update">Auto Update</Label>
                  <Switch id="auto-update" />
                </div>
                <button className="group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Support
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
