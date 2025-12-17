import { type ReactNode } from "react"
import { Outlet } from "react-router"

import { Separator } from "@/ui/components/base/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/ui/components/base/sidebar"
import { MainBreadcrumb } from "@/ui/components/main/breadcrumb"
import { AppSidebar } from "@/ui/components/main/sidebar"
import { NavUser } from "@/ui/components/main/user"
import { ThemeSwitcher } from "@/ui/components/mode-switcher"

type MainLayoutProps = {
  children?: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            <MainBreadcrumb />
          </div>

          <div className="ml-auto flex items-center gap-2 pr-4">
            <ThemeSwitcher />
            <NavUser />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children ?? <Outlet />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
