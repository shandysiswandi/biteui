import * as React from "react"
import { Gauge, ShieldCheck, SquareTerminal, Users } from "lucide-react"
import { Link } from "react-router"

import { usePermission } from "@/lib/auth/permissions"
import { actions, permissions } from "@/lib/constants/permissions"
import { routes } from "@/lib/constants/routes"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/components/base/sidebar"

import { NavContent } from "./nav-content"

const data = {
  navFeatures: [
    {
      title: "Dashboard",
      url: routes.dashboard,
      isActive: true,
      icon: Gauge,
    },
    {
      title: "Feature 1",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Page 1",
          url: routes.feature1.page1,
        },
        {
          title: "Page 2",
          url: routes.feature1.page2,
        },
      ],
    },
    {
      title: "Feature 2",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Page 1",
          url: routes.feature2.page1,
        },
        {
          title: "Page 2",
          url: routes.feature2.page2,
        },
      ],
    },
  ],
  navManagements: [
    {
      title: "Users",
      url: routes.management.users,
      icon: Users,
      permission: permissions.management.users,
      action: actions.read,
    },
    {
      title: "IAM",
      url: routes.management.iam,
      icon: ShieldCheck,
      permission: permissions.management.iam,
      action: actions.read,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const can = usePermission()

  const navManagements = data.navManagements.filter((item) => can(item.permission, item.action))

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={routes.dashboard}>
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-full">
                  <img
                    src="/android-chrome-192x192.png"
                    srcSet="/android-chrome-192x192.png 192w, /android-chrome-512x512.png 512w"
                    sizes="16px"
                    alt="BiteUI"
                    className="size-8 object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">BiteUI Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavContent items={data.navFeatures} label="Features" />
        <NavContent items={navManagements} label="Managements" />
      </SidebarContent>
    </Sidebar>
  )
}
