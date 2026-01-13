"use client"

import { useEffect, type ReactNode } from "react"
import { Bell, Cable, LockKeyhole, Paintbrush, UserLock, XIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router"

import { Button } from "@/ui/components/base/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/base/dialog"
import { Separator } from "@/ui/components/base/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/ui/components/base/sidebar"
import { useIsMobile } from "@/ui/hooks/use-mobile"

import { Header } from "./header"
import { SectionAppearance } from "./section-appearance"
import { SectionConnection } from "./section-connection"
import { SectionNotification } from "./section-notification"
import { SectionPassword } from "./section-password"
import { SectionSecurity } from "./section-security"

const SETTINGS_SECTIONS = [
  {
    nameKey: "console.settingsDialog.nav.appearance",
    icon: Paintbrush,
    hash: "setting-appearance",
  },
  {
    nameKey: "console.settingsDialog.nav.notifications",
    icon: Bell,
    hash: "setting-notifications",
  },
  {
    nameKey: "console.settingsDialog.nav.connections",
    icon: Cable,
    hash: "setting-connections",
  },
  {
    nameKey: "console.settingsDialog.nav.password",
    icon: LockKeyhole,
    hash: "setting-password",
  },
  {
    nameKey: "console.settingsDialog.nav.security",
    icon: UserLock,
    hash: "setting-security",
  },
] as const

type SettingsSection = (typeof SETTINGS_SECTIONS)[number]["hash"]

type SettingsDialogProps = {
  trigger?: ReactNode | false
  onOpenChange?: (open: boolean) => void
}

export function SettingsDialog({ trigger, onOpenChange }: SettingsDialogProps) {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const hash = location.hash.replace("#", "")

  const isValidSettingsHash = (hash: string): hash is SettingsSection => {
    return SETTINGS_SECTIONS.some((section) => section.hash === hash)
  }

  const isSettingsHash = isValidSettingsHash(hash)

  // LOGIC GUARD: Dialog force-closes if isMobile is true,
  // even if the hash is present.
  const dialogOpen = isSettingsHash && !isMobile

  const activeSection: SettingsSection = isSettingsHash
    ? (hash as SettingsSection)
    : SETTINGS_SECTIONS[0].hash

  // Auto-close and clean URL when switching to mobile
  useEffect(() => {
    if (isMobile && isSettingsHash) {
      navigate(location.pathname + location.search, { replace: true })
      onOpenChange?.(false)
    }
  }, [isMobile, isSettingsHash, navigate, location.pathname, location.search, onOpenChange])

  const handleOpenChange = (newOpen: boolean) => {
    if (isMobile) return // Prevent interaction on mobile

    onOpenChange?.(newOpen)

    if (newOpen) {
      if (!isSettingsHash) {
        navigate(
          {
            pathname: location.pathname,
            search: location.search,
            hash: SETTINGS_SECTIONS[0].hash,
          },
          { replace: true },
        )
      }
    } else {
      navigate(location.pathname + location.search, { replace: true })
    }
  }

  const handleSectionClick = (sectionHash: SettingsSection) => {
    navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: sectionHash,
      },
      { replace: true },
    )
  }

  const handleClose = () => {
    navigate(location.pathname + location.search, { replace: true })
    onOpenChange?.(false)
  }

  // If mobile, strictly do not render the dialog content to save resources
  if (isMobile) {
    return null
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger !== false && (
        <DialogTrigger asChild>
          {/* HIDE TRIGGER ON MOBILE */}
          <div className="hidden md:inline-flex">
            {trigger ?? <Button size="sm">{t("console.settingsDialog.open")}</Button>}
          </div>
        </DialogTrigger>
      )}

      <DialogContent
        className="gap-0 p-0 outline-none flex h-[80vh] md:max-w-2xl lg:max-w-4xl xl:max-w-6xl overflow-hidden"
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogTitle className="sr-only">{t("console.settingsDialog.title")}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("console.settingsDialog.description")}
        </DialogDescription>

        <SidebarProvider className="flex h-full w-full min-h-0 min-w-0 overflow-hidden items-start">
          <Sidebar collapsible="none" className="hidden md:flex w-48">
            <SidebarHeader className="p-4 h-16">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-wider">
                  {t("console.settingsDialog.title")}
                </h2>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" onClick={handleClose}>
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Close settings</span>
                  </Button>
                </DialogClose>
              </div>
            </SidebarHeader>
            <SidebarSeparator className="mx-0" />
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {SETTINGS_SECTIONS.map((section) => (
                      <SidebarMenuItem key={section.hash}>
                        <SidebarMenuButton
                          asChild
                          isActive={section.hash === activeSection}
                          onClick={() => handleSectionClick(section.hash)}
                        >
                          <button className="flex w-full items-center gap-3 px-3 py-2 text-left">
                            <section.icon className="h-4 w-4" />
                            <span>{t(section.nameKey)}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex flex-1 flex-col h-full overflow-hidden">
            <div className="flex-none px-4 mb-2">
              {activeSection === "setting-appearance" && (
                <Header
                  title={t("console.settingsDialog.nav.appearance")}
                  description="Choose your theme and personalize how the console looks."
                />
              )}
              {activeSection === "setting-notifications" && (
                <Header
                  title={t("console.settingsDialog.nav.notifications")}
                  description="Control which alerts you receive and how you want to be notified."
                />
              )}
              {activeSection === "setting-connections" && (
                <Header
                  title={t("console.settingsDialog.nav.connections")}
                  description="Link external accounts and manage connected services and permissions."
                />
              )}
              {activeSection === "setting-password" && (
                <Header
                  title="Change password"
                  description="Choose a strong password to keep your account secure."
                />
              )}
              {activeSection === "setting-security" && (
                <Header
                  title={t("console.settingsDialog.nav.security")}
                  description="Add extra protection to keep your account secure."
                />
              )}
              <Separator />
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="max-w-5xl px-4 pb-4">
                {activeSection === "setting-appearance" && <SectionAppearance />}
                {activeSection === "setting-notifications" && <SectionNotification />}
                {activeSection === "setting-connections" && <SectionConnection />}
                {activeSection === "setting-password" && <SectionPassword />}
                {activeSection === "setting-security" && <SectionSecurity />}
              </div>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
