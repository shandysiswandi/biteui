import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/ui/components/base/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/base/card"
import { Switch } from "@/ui/components/base/switch"

type PreferenceRowProps = {
  title: string
  description: string
  defaultChecked?: boolean
}

const preferences: PreferenceRowProps[] = [
  {
    title: "Compact layout",
    description: "Tighten the spacing for dense information.",
  },
  {
    title: "Auto-save drafts",
    description: "Save edits automatically while you type.",
    defaultChecked: true,
  },
]

function PreferenceRow({ title, description, defaultChecked }: PreferenceRowProps) {
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

export function PreferencesCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full">
            <SlidersHorizontal className="size-4" />
          </div>
          <div>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize how your workspace behaves.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {preferences.map((preference) => (
          <PreferenceRow key={preference.title} {...preference} />
        ))}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button type="button" variant="outline">
            Reset
          </Button>
          <Button type="button">Save preferences</Button>
        </div>
      </CardContent>
    </Card>
  )
}
