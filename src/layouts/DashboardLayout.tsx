import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { GlowingEffect } from '@/components/ui/glowing-effect'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      <div className="flex flex-1 pt-14"> {/* Add padding-top to account for fixed navbar */}
        {/* Fixed Sidebar */}
        <div className="fixed top-14 left-0 bottom-0 z-40">
          <Sidebar />
        </div>
        
        {/* Scrollable main content area */}
        <main className="flex-1 md:ml-[200px] w-full overflow-y-auto">
          <div className="container relative py-6 px-4 md:px-6 mx-auto">
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
