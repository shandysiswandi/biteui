import { Separator } from "@/ui/components/base/separator"
import { SidebarTrigger } from "@/ui/components/base/sidebar"
import { LanguageSwitcher } from "@/ui/components/language-switcher"
import { ThemeSwitcher } from "@/ui/components/mode-switcher"

import { MainBreadcrumb } from "./breadcrumb"
import { NotificationBell } from "./notification"
import { NavUser } from "./user"

export function MainHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />

        <MainBreadcrumb />
      </div>

      <div className="ml-auto flex items-center gap-2 pr-4">
        <LanguageSwitcher />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-4 hidden lg:inline"
        />
        <ThemeSwitcher />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-4 hidden md:inline"
        />
        <NotificationBell />
        <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
        <NavUser />
      </div>
    </header>
  )
}
