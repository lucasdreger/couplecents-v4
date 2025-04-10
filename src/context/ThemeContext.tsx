import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove both classes first
    root.classList.remove("light", "dark");

    // Handle system preference
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    // Add the theme class
    root.classList.add(theme);

    // Fix for GitHub Pages - ensure base styles are applied
    // and content is visible regardless of environment
    const isGitHubPages = window.location.hostname.includes('github.io');
    if (isGitHubPages) {
      // Add emergency visibility styles
      const style = document.createElement('style');
      style.id = 'github-pages-fix';
      style.textContent = `
        html, body, #root {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          height: 100% !important;
          min-height: 100% !important;
        }
        [data-rlc], .react-loading-skeleton, #root > div, main, [role="main"] {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(style);
      
      // Ensure content is shown after a delay
      setTimeout(() => {
        console.log('Applying emergency visibility styles for GitHub Pages');
        const rootElement = document.getElementById('root');
        if (rootElement) {
          rootElement.style.display = 'block';
          rootElement.style.visibility = 'visible';
          rootElement.style.opacity = '1';
        }
      }, 500);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};