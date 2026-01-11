import { useCallback, useEffect } from "react"

import { useTheme, type Theme } from "@/ui/hooks/use-theme"

import { Button } from "./base/button"
import { Kbd } from "./base/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "./base/tooltip"

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  const getNextTheme = useCallback((currentTheme: Theme) => {
    if (currentTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      return prefersDark ? "light" : "dark"
    }

    return currentTheme === "dark" ? "light" : "dark"
  }, [])

  const handleThemeToggle = useCallback(() => {
    setTheme(getNextTheme(theme))
  }, [getNextTheme, setTheme, theme])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey) {
        return
      }

      const target = event.target
      const isTypingTarget =
        target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))

      if (isTypingTarget) {
        return
      }

      if (event.key.toLowerCase() === "d") {
        event.preventDefault()
        handleThemeToggle()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleThemeToggle])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group/toggle extend-touch-target size-8 hidden md:inline-flex"
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4.5"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M12 3l0 18" />
            <path d="M12 9l4.65 -4.65" />
            <path d="M12 14.3l7.37 -7.37" />
            <path d="M12 19.6l8.85 -8.85" />
          </svg>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2">
        Toggle Mode <Kbd>D</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
