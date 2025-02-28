import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">ExpenseEmpower</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          {user?.email}
          <Button variant="ghost" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  );
}
