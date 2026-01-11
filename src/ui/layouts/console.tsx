import { type ReactNode } from "react"
import { Outlet } from "react-router"

import { SidebarInset, SidebarProvider } from "@/ui/components/base/sidebar"

import { MainHeader } from "./components/console/header"
import { AppSidebar } from "./components/console/sidebar"

type MainLayoutProps = {
  children?: ReactNode
}

export default function ConsoleLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="min-w-0 flex flex-col">
        <MainHeader />

        <main className="min-h-0 flex-1 overflow-auto">
          <div className="flex flex-col gap-4 p-4 min-w-0">{children ?? <Outlet />}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
