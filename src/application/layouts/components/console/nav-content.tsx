import { ChevronRight, type LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, matchPath, useLocation } from "react-router"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/ui/components/base/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/ui/components/base/sidebar"

interface NavContentProps {
  labelKey: string
  items: {
    titleKey: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      titleKey: string
      url: string
    }[]
  }[]
}

export function NavContent({ items, labelKey }: NavContentProps) {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(labelKey)}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isItemActive =
            item.url !== "#" && !!matchPath({ path: item.url, end: true }, location.pathname)

          const hasSubItems = (item.items?.length ?? 0) > 0

          const hasActiveChild =
            item.items?.some((subItem) =>
              matchPath({ path: subItem.url, end: true }, location.pathname),
            ) ?? false

          const isActive = isItemActive || hasActiveChild

          const itemLabel = t(item.titleKey)

          return (
            <Collapsible key={item.titleKey} asChild defaultOpen={isActive}>
              <SidebarMenuItem>
                {hasSubItems ? (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={itemLabel} isActive={isActive} className="group">
                      <item.icon />
                      <span>{itemLabel}</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={itemLabel}
                    isActive={isActive}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground duration-200 ease-linear"
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{itemLabel}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
                {hasSubItems && (
                  <>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSubActive = !!matchPath(
                            { path: subItem.url, end: true },
                            location.pathname,
                          )

                          return (
                            <SidebarMenuSubItem key={subItem.titleKey}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isSubActive}
                                className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground duration-200 ease-linear"
                              >
                                <Link to={subItem.url}>
                                  <span>{t(subItem.titleKey)}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
