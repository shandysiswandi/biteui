import { useCallback, useEffect, useMemo, useState } from "react"

import {
  SCHEMES,
  ThemeModeProviderContext,
  type ThemeMode,
  type ThemeScheme,
  type ThemeTransitionCoords,
} from "@/ui/hooks/use-theme"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultMode?: ThemeMode
  defaultScheme?: ThemeScheme
  storageKeyMode?: string
  storageKeyScheme?: string
}

const isMode = (v: string | null): v is ThemeMode => v === "dark" || v === "light" || v === "system"

const isScheme = (v: string | null): v is ThemeScheme =>
  !!v && (SCHEMES as readonly string[]).includes(v)

export function ThemeProvider({
  children,
  defaultMode = "system",
  defaultScheme = "default",
  storageKeyMode = "bite-ui-mode",
  storageKeyScheme = "bite-ui-scheme",
  ...props
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(storageKeyMode)
    return isMode(stored) ? stored : defaultMode
  })

  const [scheme, setSchemeState] = useState<ThemeScheme>(() => {
    const stored = localStorage.getItem(storageKeyScheme)
    return isScheme(stored) ? stored : defaultScheme
  })

  const resolveMode = useCallback((m: ThemeMode) => {
    if (m !== "system") return m
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }, [])

  const applyHtmlClasses = useCallback(
    (nextMode: ThemeMode, nextScheme: ThemeScheme) => {
      const root = document.documentElement

      // remove old mode classes
      root.classList.remove("light", "dark")

      // remove old scheme classes (only ones you use)
      SCHEMES.forEach((s) => {
        if (s !== "default") root.classList.remove(s)
      })

      // add scheme (skip if default)
      if (nextScheme !== "default") root.classList.add(nextScheme)

      // add resolved mode
      root.classList.add(resolveMode(nextMode))
    },
    [resolveMode],
  )

  useEffect(() => {
    applyHtmlClasses(mode, scheme)
  }, [mode, scheme, applyHtmlClasses])

  // if system mode and OS changes, update html class
  useEffect(() => {
    if (mode !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => applyHtmlClasses("system", scheme)
    mq.addEventListener?.("change", handler)
    return () => mq.removeEventListener?.("change", handler)
  }, [mode, scheme, applyHtmlClasses])

  const startTransition = useCallback(
    (coords: ThemeTransitionCoords | undefined, cb: () => void) => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (!document.startViewTransition || prefersReduced) {
        cb()
        return
      }

      const root = document.documentElement
      if (coords) {
        root.style.setProperty("--x", `${coords.x}px`)
        root.style.setProperty("--y", `${coords.y}px`)
      }

      document.startViewTransition(cb)
    },
    [],
  )

  const setScheme = useCallback(
    (nextScheme: ThemeScheme, coords?: ThemeTransitionCoords) => {
      startTransition(coords, () => {
        localStorage.setItem(storageKeyScheme, nextScheme)
        setSchemeState(nextScheme)
      })
    },
    [startTransition, storageKeyScheme],
  )

  const toggleMode = useCallback(
    (coords?: ThemeTransitionCoords) => {
      const next: ThemeMode =
        mode === "system"
          ? resolveMode("system") === "dark"
            ? "light"
            : "dark"
          : mode === "dark"
            ? "light"
            : "dark"

      startTransition(coords, () => {
        localStorage.setItem(storageKeyMode, next)
        setMode(next)
      })
    },
    [mode, resolveMode, startTransition, storageKeyMode],
  )

  const value = useMemo(
    () => ({ mode, scheme, setMode, toggleMode, setScheme }),
    [mode, scheme, setMode, toggleMode, setScheme],
  )

  return (
    <ThemeModeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeModeProviderContext.Provider>
  )
}
