import { useState } from "react"
import { Bell } from "lucide-react"
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

type NotificationItem = {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Order shipped",
    description: "Order #4312 is on the way and arriving tomorrow.",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    title: "New comment",
    description: "Maya left feedback on the Q3 planning doc.",
    time: "1h ago",
    read: false,
  },
  {
    id: "3",
    title: "Weekly report",
    description: "Your analytics summary is ready to view.",
    time: "Yesterday",
    read: true,
  },
]

export function NotificationBell() {
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
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
              {badgeLabel}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" side="bottom" sideOffset={8}>
        <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
          <span className="text-sm font-medium">Notifications</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
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
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={routes.user.notifications}>View all</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
