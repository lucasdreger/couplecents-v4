
"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/ThemeContext"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  // Use the actual theme state from ThemeContext
  const { theme, setTheme } = useTheme()
  const [isDark, setIsDark] = useState(theme === "dark")

  // Keep local state in sync with context
  useEffect(() => {
    setIsDark(theme === "dark")
  }, [theme])

  // Update theme when toggle is clicked
  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    setTheme(newTheme)
    setIsDark(!isDark)
  }

  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
        isDark 
          ? "bg-slate-800 border border-slate-700" 
          : "bg-primary/10 border border-primary/20",
        className
      )}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark 
              ? "transform translate-x-0 bg-slate-700 text-primary" 
              : "transform translate-x-8 bg-white text-primary shadow-sm"
          )}
        >
          {isDark ? (
            <Moon 
              className="w-4 h-4" 
              strokeWidth={1.5}
            />
          ) : (
            <Sun 
              className="w-4 h-4" 
              strokeWidth={1.5}
            />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark 
              ? "bg-transparent" 
              : "transform -translate-x-8"
          )}
        >
          {isDark ? (
            <Sun 
              className="w-4 h-4 text-slate-500" 
              strokeWidth={1.5}
            />
          ) : (
            <Moon 
              className="w-4 h-4 text-slate-500" 
              strokeWidth={1.5}
            />
          )}
        </div>
      </div>
    </div>
  )
}
