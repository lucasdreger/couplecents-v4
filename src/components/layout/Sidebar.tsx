
import React from 'react'
import { NavLink } from "react-router-dom"
import { MainNav } from "@/components/navigation/MainNav"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Sparkles } from "@/components/ui/sparkles"
import { useTheme } from "@/context/ThemeContext"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean
}

export function Sidebar({ className, isCollapsed, ...props }: SidebarProps) {
  const { theme } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="w-[80vw] p-4">
          <div className="relative mb-6">
            <span className="text-lg font-semibold">Expense Empower</span>
            <div className="absolute -inset-1">
              <Sparkles 
                className="h-full w-full"
                color={theme === "dark" ? "#8350e8" : "#8350e8"}
                size={2}
                density={50}
                speed={0.5}
                opacity={0.3}
              />
            </div>
          </div>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
            <MainNav />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed hidden h-screen border-r bg-background md:flex md:w-[200px] ${className}`}
        {...props}
      >
        <ScrollArea className="w-full">
          <div className="relative flex h-[60px] items-center px-6">
            <span className="text-lg font-semibold">Expense Empower</span>
            <div className="absolute -inset-1">
              <Sparkles 
                className="h-full w-full"
                color={theme === "dark" ? "#8350e8" : "#8350e8"}
                size={2}
                density={50}
                speed={0.5}
                opacity={0.3}
              />
            </div>
          </div>
          <div className="space-y-4 py-4">
            <MainNav />
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}
