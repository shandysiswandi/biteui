"use client"

import { Check, Monitor, Moon, Sun, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils/tailwind"
import { Label } from "@/ui/components/base/label"
import { Separator } from "@/ui/components/base/separator"
import { useTheme, type ThemeScheme, type ThemeTransitionCoords } from "@/ui/hooks/use-theme"

export function SectionAppearance() {
  const { mode, setMode, scheme, setScheme } = useTheme()

  return (
    <div className="space-y-8">
      {/* --- THEME MODE SECTION --- */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-base font-medium">Theme Mode</Label>
          <p className="text-sm text-muted-foreground">
            Select how the console looks on your device.
          </p>
        </div>

        <div className="grid max-w-3xl grid-cols-3 gap-4">
          <ThemeCard
            label="Light"
            icon={Sun}
            isActive={mode === "light"}
            onClick={() => setMode("light")}
          >
            {/* Visual Mockup for Light Mode */}
            <div className="bg-[#F4F4F5] p-2 h-full w-full">
              <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                <div className="h-2 w-20 rounded-lg bg-[#E4E4E7]" />
                <div className="h-2 w-25 rounded-lg bg-[#E4E4E7]" />
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-md bg-white p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#E4E4E7]" />
                <div className="h-2 w-20 rounded-lg bg-[#E4E4E7]" />
              </div>
            </div>
          </ThemeCard>

          <ThemeCard
            label="Dark"
            icon={Moon}
            isActive={mode === "dark"}
            onClick={() => setMode("dark")}
          >
            {/* Visual Mockup for Dark Mode */}
            <div className="bg-[#18181B] p-2 h-full w-full">
              <div className="space-y-2 rounded-md bg-[#27272A] p-2 shadow-sm border border-[#3F3F46]">
                <div className="h-2 w-20 rounded-lg bg-[#3F3F46]" />
                <div className="h-2 w-25 rounded-lg bg-[#3F3F46]" />
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-md bg-[#27272A] p-2 shadow-sm border border-[#3F3F46]">
                <div className="h-4 w-4 rounded-full bg-[#3F3F46]" />
                <div className="h-2 w-20 rounded-lg bg-[#3F3F46]" />
              </div>
            </div>
          </ThemeCard>

          <ThemeCard
            label="System"
            icon={Monitor}
            isActive={mode === "system"}
            onClick={() => setMode("system")}
          >
            {/* Visual Mockup for System (Split) */}
            <div className="relative h-full w-full overflow-hidden flex">
              <div className="w-1/2 bg-[#F4F4F5] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 w-10 rounded-lg bg-[#E4E4E7]" />
                </div>
              </div>
              <div className="w-1/2 bg-[#18181B] p-2">
                <div className="space-y-2 rounded-md bg-[#27272A] p-2 shadow-sm border border-[#3F3F46]">
                  <div className="h-2 w-10 rounded-lg bg-[#3F3F46]" />
                </div>
              </div>
            </div>
          </ThemeCard>
        </div>
      </div>

      <Separator />

      {/* --- COLOR SCHEME SECTION --- */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-base font-medium">Theme Color</Label>
          <p className="text-sm text-muted-foreground">Choose the primary color for the theme.</p>
        </div>

        <div className="grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          <ColorOption
            name="default"
            label="Default"
            activeScheme={scheme}
            setScheme={setScheme}
            // Default often uses neutral blacks/whites, so we map it to 'zinc' visually
            className="bg-foreground"
          />
          <ColorOption
            name="blue"
            label="Blue"
            activeScheme={scheme}
            setScheme={setScheme}
            className="bg-blue-600"
          />
          <ColorOption
            name="violet"
            label="Violet"
            activeScheme={scheme}
            setScheme={setScheme}
            className="bg-violet-600"
          />
          <ColorOption
            name="rose"
            label="Rose"
            activeScheme={scheme}
            setScheme={setScheme}
            className="bg-rose-600"
          />
          <ColorOption
            name="green"
            label="Green"
            activeScheme={scheme}
            setScheme={setScheme}
            className="bg-emerald-600"
          />
          <ColorOption
            name="orange"
            label="Orange"
            activeScheme={scheme}
            setScheme={setScheme}
            className="bg-orange-600"
          />
          <ColorOption
            name="yellow"
            label="Yellow"
            activeScheme={scheme}
            setScheme={setScheme}
            className="bg-yellow-600"
          />
          <ColorOption
            name="red"
            label="Red"
            activeScheme={scheme}
            setScheme={setScheme}
            className="bg-red-600"
          />
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function ThemeCard({
  label,
  icon: Icon,
  isActive,
  onClick,
  children,
}: {
  label: string
  icon: LucideIcon
  isActive: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-2 text-left outline-none",
        "transition-all duration-200 ease-in-out hover:opacity-90 active:scale-[0.98]",
      )}
    >
      <div
        className={cn(
          "relative flex h-24 w-full overflow-hidden rounded-xl border-2 shadow-sm transition-all",
          isActive
            ? "border-primary ring-2 ring-primary/20 ring-offset-2"
            : "border-muted group-hover:border-primary/50",
        )}
      >
        {children}
      </div>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
            isActive
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/50",
          )}
        >
          {isActive && <Check className="h-2.5 w-2.5" />}
        </div>

        <Icon className="h-4 w-4 text-muted-foreground" />

        <span
          className={cn(
            "text-sm font-medium",
            isActive ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>
    </button>
  )
}

function ColorOption({
  name,
  label,
  activeScheme,
  setScheme,
  className,
}: {
  name: ThemeScheme
  label: string
  activeScheme: ThemeScheme
  setScheme: (s: ThemeScheme, coords?: ThemeTransitionCoords) => void
  className: string
}) {
  const isActive = activeScheme === name

  return (
    <button
      onClick={(e) => setScheme(name, { x: e.clientX, y: e.clientY })}
      className={cn(
        "group relative flex items-center justify-between rounded-lg border p-1 pl-3 pr-2 transition-all hover:bg-muted/50",
        isActive ? "border-primary bg-muted/30 ring-1 ring-primary/20" : "border-border",
      )}
    >
      <div className="flex items-center gap-3">
        {/* Color Circle */}
        <div className={cn("h-4 w-4 rounded-full shadow-sm", className)} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
    </button>
  )
}
