import { createContext, useContext } from "react"

export const SCHEMES = [
  "default",
  "yellow",
  "green",
  "orange",
  "red",
  "rose",
  "blue",
  "violet",
] as const

export type ThemeMode = "dark" | "light" | "system"
export type ThemeScheme = (typeof SCHEMES)[number]
export type ThemeTransitionCoords = { x: number; y: number }

type ThemeProviderState = {
  mode: ThemeMode
  scheme: ThemeScheme
  toggleMode: (coords?: ThemeTransitionCoords) => void
  setMode: (mode: ThemeMode) => void
  setScheme: (scheme: ThemeScheme, coords?: ThemeTransitionCoords) => void
}

export const ThemeModeProviderContext = createContext<ThemeProviderState | null>(null)

export function useTheme() {
  const context = useContext(ThemeModeProviderContext)
  if (!context) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
