import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { BeamsBackground } from '@/components/ui/aurora-background'
import { useTheme } from '@/context/ThemeContext'

export function DashboardLayout() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Fixed Navbar at the top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      <div className="flex flex-1">
        {/* Fixed Sidebar */}
        <div className="fixed top-14 left-0 bottom-0 z-40 md:w-auto">
          <Sidebar />
        </div>
        
        {/* Scrollable main content area with BeamsBackground */}
        <main className="flex-1 w-full pt-14 md:pl-[60px] overflow-y-auto transition-all duration-300">
          <BeamsBackground 
            className="min-h-full items-start justify-start p-0"
            intensity={isDarkMode ? "medium" : "subtle"}
          >
            <div className="container max-w-6xl mx-auto py-6 px-4 w-full">
              {/* Content container with improved contrast for dark mode */}
              <div className="relative min-h-[calc(100vh-theme(spacing.14)-theme(spacing.12))] rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-sm">
                <Outlet />
              </div>
            </div>
          </BeamsBackground>
        </main>
      </div>
    </div>
  )
}
