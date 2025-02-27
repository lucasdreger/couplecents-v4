
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">ExpenseEmpower</h1>
        <div className="flex items-center gap-4">
          {user?.email}
          <Button variant="ghost" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  );
}
