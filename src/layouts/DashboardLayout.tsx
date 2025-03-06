import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { BeamsBackground } from '@/components/ui/beams-background'
import { useTheme } from '@/context/ThemeContext'

export function DashboardLayout() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Fixed Navbar at the top */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/40">
        <Navbar />
      </div>
      
      <div className="flex flex-1">
        {/* Fixed Sidebar */}
        <div className="fixed top-14 left-0 bottom-0 z-40 md:w-auto border-r border-slate-800/40">
          <Sidebar />
        </div>
        
        {/* Scrollable main content area with theme-based background */}
        <main className="flex-1 w-full pt-14 md:pl-[60px] overflow-y-auto transition-all duration-300">
          {isDarkMode ? (
            <BeamsBackground 
              className="min-h-full items-start justify-start p-0"
              intensity="medium"
            >
              <div className="container max-w-6xl mx-auto py-6 px-4 w-full">
                <div className="relative min-h-[calc(100vh-theme(spacing.14)-theme(spacing.12))] rounded-xl border border-slate-800/60 bg-slate-900/80 backdrop-blur-xl p-6 shadow-lg">
                  <Outlet />
                </div>
              </div>
            </BeamsBackground>
          ) : (
            <AuroraBackground 
              className="min-h-full items-start justify-start p-0"
              showRadialGradient={true}
            >
              <div className="container max-w-6xl mx-auto py-6 px-4 w-full">
                <div className="relative min-h-[calc(100vh-theme(spacing.14)-theme(spacing.12))] rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 shadow-sm">
                  <Outlet />
                </div>
              </div>
            </AuroraBackground>
          )}
        </main>
      </div>
    </div>
  )
}
