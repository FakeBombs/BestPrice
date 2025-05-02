
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider attribute="data-theme" {...props}>{children}</NextThemesProvider>
}

export function useTheme() {
  const [theme, setThemeState] = React.useState<string>('light');
  
  React.useEffect(() => {
    // Get the theme from local storage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setThemeState(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);
  
  const setTheme = React.useCallback((newTheme: string) => {
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setThemeState(newTheme);
  }, []);
  
  return {
    theme,
    setTheme,
  };
}
