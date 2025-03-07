
import { Link } from 'react-router-dom';
import { MainNav } from '@/components/layout/MainNav';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from '@/components/ui/sparkles';
import { cn } from '@/lib/utils';
import { useTheme } from "@/context/ThemeContext";
import { UserNav } from "./UserNav";

export function Navbar() {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar/80 backdrop-blur-md border-b border-slate-800/40">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center gap-2 md:gap-3">
            <Sparkles
              className="relative h-6 w-6 transform-gpu"
              color={theme === "dark" ? "var(--sparkles-color)" : "#8350e8"}
              size={1.2}
              density={50}
              speed={0.3}
              opacity={0.2}
            />
            <span className="hidden font-bold md:inline-block">
              CoupleCents
            </span>
          </Link>
        </div>
        
        <MainNav className="mx-6 hidden md:block" />
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}

Navbar.displayName = "Navbar";
