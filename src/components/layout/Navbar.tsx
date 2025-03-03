
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, User } from "lucide-react";
import { Sparkles } from "@/components/ui/sparkles";

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b relative overflow-hidden">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center relative z-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          ExpenseEmpower
        </h1>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
            <div className="bg-primary/20 p-1 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </div>
      
      {/* Background sparkles */}
      <div className="absolute inset-0 z-0">
        <Sparkles 
          color={theme === "dark" ? "var(--sparkles-color)" : "#8350e8"} 
          size={0.7}
          density={50}
          speed={0.1}
          opacity={0.1}
        />
      </div>
    </nav>
  );
}
