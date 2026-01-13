import { useState } from "react"
import { Bell } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import { routes } from "@/lib/constants/routes"
import { cn } from "@/lib/utils/tailwind"
import { Button } from "@/ui/components/base/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/components/base/dropdown-menu"
import { ScrollArea } from "@/ui/components/base/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/components/base/tooltip"

type NotificationItem = {
  id: string
  titleKey: string
  descriptionKey: string
  timeKey: string
  read: boolean
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    titleKey: "console.notifications.items.orderShipped.title",
    descriptionKey: "console.notifications.items.orderShipped.description",
    timeKey: "console.notifications.items.orderShipped.time",
    read: false,
  },
  {
    id: "2",
    titleKey: "console.notifications.items.newComment.title",
    descriptionKey: "console.notifications.items.newComment.description",
    timeKey: "console.notifications.items.newComment.time",
    read: false,
  },
  {
    id: "3",
    titleKey: "console.notifications.items.weeklyReport.title",
    descriptionKey: "console.notifications.items.weeklyReport.description",
    timeKey: "console.notifications.items.weeklyReport.time",
    read: true,
  },
  {
    id: "4",
    titleKey: "console.notifications.items.newComment.title",
    descriptionKey: "console.notifications.items.newComment.description",
    timeKey: "console.notifications.items.newComment.time",
    read: false,
  },
  {
    id: "5",
    titleKey: "console.notifications.items.weeklyReport.title",
    descriptionKey: "console.notifications.items.weeklyReport.description",
    timeKey: "console.notifications.items.weeklyReport.time",
    read: true,
  },
]

export function NotificationBell() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)

  const handleMarkAllRead = () => {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })))
  }

  const handleItemRead = (id: string) => {
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, read: true } : item)),
    )
  }

  const unreadCount = notifications.filter((item) => !item.read).length
  const badgeLabel = unreadCount > 9 ? "9+" : `${unreadCount}`

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="size-4" />
              <span className="sr-only">{t("console.notifications.label")}</span>
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                  {badgeLabel}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("console.notifications.label")}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-80" align="end" side="bottom" sideOffset={8}>
        <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
          <span className="text-sm font-medium">{t("console.notifications.label")}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            {t("console.notifications.markAllRead")}
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-72">
          <DropdownMenuGroup className="grid gap-1 p-1">
            {notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onSelect={() => handleItemRead(item.id)}
                className={cn(
                  "flex cursor-pointer flex-col items-start gap-1 rounded-md px-2 py-2 text-left",
                  item.read ? "opacity-70" : "bg-muted/40 hover:bg-muted",
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm font-medium">{t(item.titleKey)}</span>
                  <span className="text-xs text-muted-foreground">{t(item.timeKey)}</span>
                </div>
                <span className="text-xs text-muted-foreground">{t(item.descriptionKey)}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild variant="default">
          <Link to={routes.user.notifications} className="flex justify-center items-center w-full">
            {t("console.notifications.viewAll")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
