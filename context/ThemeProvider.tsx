"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState('');

  // Resolve the saved preference (or the OS setting) to a concrete theme,
  // once, on mount. `mode` is always kept as 'light' | 'dark' so consumers
  // can rely on it directly.
  useEffect(() => {
    const prefersDark =
      localStorage.theme === 'dark' ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setMode(prefersDark ? 'dark' : 'light');
  }, [])

  // Apply the theme to the DOM whenever it changes. This effect only reads
  // `mode` and writes a class — it never calls setMode, so it cannot
  // retrigger itself (the "Maximum update depth exceeded" loop in #32).
  useEffect(() => {
    if (!mode) return;

    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode])

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if(context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context;
}