import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { GlowingEffect } from '@/components/ui/glowing-effect'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Fixed Navbar at the top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      <div className="flex flex-1">
        {/* Fixed Sidebar */}
        <div className="fixed top-14 left-0 bottom-0 z-40 md:w-auto">
          <Sidebar />
        </div>
        
        {/* Scrollable main content area - shifted down and right to accommodate fixed navbar and sidebar */}
        <main className="flex-1 w-full pt-14 md:pl-[60px] overflow-y-auto transition-all duration-300">
          <div className="container max-w-6xl mx-auto py-6 px-4">
            {/* Add subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/30 pointer-events-none -z-10" />
            
            {/* Create a nice border around the content with a glowing effect */}
            <div className="relative min-h-[calc(100vh-theme(spacing.14)-theme(spacing.12))] rounded-xl border bg-card p-6 shadow-sm">
              <div className="absolute inset-0 rounded-xl">
                <GlowingEffect 
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={100}
                  inactiveZone={0.5}
                  borderWidth={1}
                />
              </div>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
