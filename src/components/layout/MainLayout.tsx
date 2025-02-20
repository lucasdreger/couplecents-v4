/**
 * Application Layout Component
 * 
 * Provides:
 * - Authentication protection
 * - Navigation menu
 * - Consistent layout structure
 * - Sign out functionality
 * - Responsive design
 * 
 * All routes wrapped in this layout are protected and require authentication.
 */

import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export const MainLayout = () => {
  const { isAuthenticated, signOut } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">Dashboard</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/expenses">Expenses</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/investments">Investments</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/reserves">Reserves</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/income">Income</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/fixed-expenses">Fixed Expenses</Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="ml-auto">
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        </div>
      </header>
      <main className="container px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
