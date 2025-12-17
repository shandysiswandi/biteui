import type { LucideIcon } from "lucide-react"
import { Bell, Mail, MessageSquare } from "lucide-react"

import { Badge } from "@/ui/components/base/badge"
import { Button } from "@/ui/components/base/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/base/card"
import { Switch } from "@/ui/components/base/switch"

type NotificationItemProps = {
  icon: LucideIcon
  title: string
  description: string
  badgeLabel: string
  badgeVariant: "secondary" | "outline"
  timestamp: string
  iconClassName: string
}

type PreferenceRowProps = {
  title: string
  description: string
  defaultChecked?: boolean
}

const notifications: NotificationItemProps[] = [
  {
    icon: Bell,
    title: "Weekly activity recap",
    description: "Your profile had 24 views and 3 new followers this week.",
    badgeLabel: "Unread",
    badgeVariant: "secondary",
    timestamp: "2 hours ago",
    iconClassName: "bg-primary/10 text-primary",
  },
  {
    icon: Mail,
    title: "Email verified",
    description: "Your email address is now verified and protected.",
    badgeLabel: "Security",
    badgeVariant: "outline",
    timestamp: "Yesterday",
    iconClassName: "bg-muted text-muted-foreground",
  },
  {
    icon: MessageSquare,
    title: "Support replied",
    description: "We sent updates about your recent support ticket.",
    badgeLabel: "Read",
    badgeVariant: "secondary",
    timestamp: "Aug 12",
    iconClassName: "bg-muted text-muted-foreground",
  },
]

const preferences: PreferenceRowProps[] = [
  {
    title: "Product updates",
    description: "News and feature highlights from the team.",
    defaultChecked: true,
  },
  {
    title: "Security alerts",
    description: "Critical alerts about your account activity.",
    defaultChecked: true,
  },
  {
    title: "Mentions and replies",
    description: "Get notified when someone replies to you.",
  },
]

function NotificationItem({
  icon: Icon,
  title,
  description,
  badgeLabel,
  badgeVariant,
  timestamp,
  iconClassName,
}: NotificationItemProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex size-9 items-center justify-center rounded-full ${iconClassName}`}
        >
          <Icon className="size-4" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant={badgeVariant}>{badgeLabel}</Badge>
            <span className="text-muted-foreground">{timestamp}</span>
          </div>
        </div>
      </div>
      <Button type="button" variant="ghost" size="sm" className="sm:mt-1">
        View
      </Button>
    </div>
  )
}

function PreferenceRow({
  title,
  description,
  defaultChecked,
}: PreferenceRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} aria-label={`Toggle ${title}`} />
    </div>
  )
}

export default function Page() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Stay updated with your latest account activity.
          </CardDescription>
          <CardAction>
            <Button type="button" variant="outline" size="sm">
              Mark all as read
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem key={notification.title} {...notification} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification preferences</CardTitle>
          <CardDescription>
            Choose how you want to stay informed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferences.map((preference) => (
            <PreferenceRow key={preference.title} {...preference} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
