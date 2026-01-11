"use client"

import * as React from "react"
import {
  Bell,
  Globe,
  Keyboard,
  Link as LinkIcon,
  Lock,
  MessageCircle,
  Paintbrush,
  Settings,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/components/base/breadcrumb"
import { Button } from "@/ui/components/base/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/base/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/ui/components/base/sidebar"

const data = {
  nav: [
    { nameKey: "console.settingsDialog.nav.notifications", icon: Bell, to: "#notifications" },
    { nameKey: "console.settingsDialog.nav.appearance", icon: Paintbrush, to: "#appearance" },
    {
      nameKey: "console.settingsDialog.nav.messagesMedia",
      icon: MessageCircle,
      to: "#messages-media",
    },
    { nameKey: "console.settingsDialog.nav.languageRegion", icon: Globe, to: "#language-region" },
    { nameKey: "console.settingsDialog.nav.accessibility", icon: Keyboard, to: "#accessibility" },
    {
      nameKey: "console.settingsDialog.nav.connectedAccounts",
      icon: LinkIcon,
      to: "#connected-accounts",
    },
    {
      nameKey: "console.settingsDialog.nav.privacyVisibility",
      icon: Lock,
      to: "#privacy-visibility",
    },
    { nameKey: "console.settingsDialog.nav.advanced", icon: Settings, to: "#advanced" },
  ],
}

type SettingsDialogProps = {
  trigger?: React.ReactNode | false
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SettingsDialog({ trigger, open, onOpenChange }: SettingsDialogProps) {
  const { t } = useTranslation()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const handleOpenChange = onOpenChange ?? setInternalOpen
  const shouldRenderTrigger = trigger !== false
  const location = useLocation()
  const activeHash = location.hash || data.nav[0]?.to

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {shouldRenderTrigger ? (
        <DialogTrigger asChild>
          {trigger ?? <Button size="sm">{t("console.settingsDialog.open")}</Button>}
        </DialogTrigger>
      ) : null}
      <DialogContent
        className="overflow-hidden p-0 md:max-h-125 md:max-w-175 lg:max-w-200"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogTitle className="sr-only">{t("console.settingsDialog.title")}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("console.settingsDialog.description")}
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.nameKey}>
                        <SidebarMenuButton asChild isActive={item.to === activeHash}>
                          <Link to={item.to}>
                            <item.icon />
                            <span>{t(item.nameKey)}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-120 flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        {t("console.settingsDialog.breadcrumb.settings")}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {t("console.settingsDialog.breadcrumb.messagesMedia")}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-muted/50 aspect-video max-w-3xl rounded-xl" />
              ))}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
