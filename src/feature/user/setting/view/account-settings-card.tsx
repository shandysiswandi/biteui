import { UserRound } from "lucide-react"

import { Button } from "@/ui/components/base/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/base/card"
import { Input } from "@/ui/components/base/input"
import { Label } from "@/ui/components/base/label"

export function AccountSettingsCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
            <UserRound className="size-4" />
          </div>
          <div>
            <CardTitle>Account settings</CardTitle>
            <CardDescription>Keep your account details and preferences current.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="display-name">Display name</Label>
            <Input id="display-name" placeholder="Your display name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" placeholder="UTC+07:00 Jakarta" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button type="button" variant="outline">
            Reset
          </Button>
          <Button type="button">Save changes</Button>
        </div>
      </CardContent>
    </Card>
  )
}
