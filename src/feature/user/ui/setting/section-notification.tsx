"use client"

import { useState } from "react"
import { Bell, Clock, Mail } from "lucide-react"

import { Button } from "@/ui/components/base/button"
import { Label } from "@/ui/components/base/label"
import { RadioGroup, RadioGroupItem } from "@/ui/components/base/radio-group"
import { Separator } from "@/ui/components/base/separator"
import { Switch } from "@/ui/components/base/switch"

export function SectionNotification() {
  // Example state - normally this would come from your backend/store
  const [schedule, setSchedule] = useState("instant")

  return (
    <div className="space-y-8">
      {/* --- ACTIVITY ALERTS --- */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Activity Alerts</h3>
          <p className="text-sm text-muted-foreground">
            Select which events trigger a notification.
          </p>
        </div>

        <div className="divide-y rounded-lg border">
          <NotificationRow
            title="New sign-in detected"
            description="Alert when your account is accessed from a new device or location."
            defaultChecked={true}
          />
          <NotificationRow
            title="Team invites"
            description="Receive an email when someone invites you to a team."
            defaultChecked={true}
          />
          <NotificationRow
            title="Project updates"
            description="Weekly summary of project activity and milestones."
            defaultChecked={false}
          />
          <NotificationRow
            title="Billing alerts"
            description="Get notified when you approach your usage limits."
            defaultChecked={true}
          />
        </div>
      </div>

      <Separator />

      {/* --- EMAIL DIGEST SCHEDULE --- */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Email Frequency</h3>
          <p className="text-sm text-muted-foreground">
            How often should we send you non-critical updates?
          </p>
        </div>

        <RadioGroup
          value={schedule}
          onValueChange={setSchedule}
          className="grid gap-4 md:grid-cols-3"
        >
          <div>
            <RadioGroupItem value="instant" id="sch-instant" className="peer sr-only" />
            <Label
              htmlFor="sch-instant"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary"
            >
              <Bell className="mb-3 h-6 w-6" />
              <div className="space-y-1 text-center">
                <div className="font-semibold">Instant</div>
                <div className="text-xs text-muted-foreground">Send as they happen</div>
              </div>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="daily" id="sch-daily" className="peer sr-only" />
            <Label
              htmlFor="sch-daily"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary"
            >
              <Clock className="mb-3 h-6 w-6" />
              <div className="space-y-1 text-center">
                <div className="font-semibold">Daily Digest</div>
                <div className="text-xs text-muted-foreground">Once a day at 9:00 AM</div>
              </div>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="weekly" id="sch-weekly" className="peer sr-only" />
            <Label
              htmlFor="sch-weekly"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary"
            >
              <Mail className="mb-3 h-6 w-6" />
              <div className="space-y-1 text-center">
                <div className="font-semibold">Weekly</div>
                <div className="text-xs text-muted-foreground">Summary on Mondays</div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Preferences</Button>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function NotificationRow({
  title,
  description,
  defaultChecked,
}: {
  title: string
  description: string
  defaultChecked: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="space-y-0.5">
        <h4 className="text-sm font-medium leading-none">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}
