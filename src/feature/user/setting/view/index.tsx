import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/components/base/tabs"

import { AccountSettingsCard } from "./account-settings-card"
import { PreferencesCard } from "./preferences-card"
import { SecurityCard } from "./security-card"

export default function Page() {
  return (
    <Tabs defaultValue="general" className="gap-6 lg:flex-row">
      <aside className="lg:w-64 lg:border-r lg:pr-6">
        <div className="space-y-4 lg:sticky lg:top-20">
          <div>
            <h1 className="text-xl font-semibold">Settings</h1>
            <p className="text-muted-foreground text-sm">Manage your preferences and security.</p>
          </div>
          <TabsList className="h-auto w-full flex-col items-stretch gap-2 bg-transparent p-0">
            <TabsTrigger
              value="general"
              className="h-auto flex-none flex-col items-start justify-start gap-1 px-3 py-2"
            >
              <span className="text-sm font-medium">General</span>
              <span className="text-muted-foreground text-xs">
                Workspace preferences and defaults.
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="h-auto flex-none flex-col items-start justify-start gap-1 px-3 py-2"
            >
              <span className="text-sm font-medium">Account</span>
              <span className="text-muted-foreground text-xs">
                Profile details and personal info.
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="h-auto flex-none flex-col items-start justify-start gap-1 px-3 py-2"
            >
              <span className="text-sm font-medium">Security</span>
              <span className="text-muted-foreground text-xs">
                Authentication and privacy controls.
              </span>
            </TabsTrigger>
          </TabsList>
        </div>
      </aside>

      <div className="min-w-0 flex-1 lg:pl-6">
        <TabsContent value="general" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">General</h2>
            <p className="text-muted-foreground text-sm">
              Set your workspace defaults and preferences.
            </p>
          </div>
          <PreferencesCard />
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Account</h2>
            <p className="text-muted-foreground text-sm">
              Update personal details tied to your account.
            </p>
          </div>
          <AccountSettingsCard />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Security</h2>
            <p className="text-muted-foreground text-sm">
              Protect your account with stronger authentication.
            </p>
          </div>
          <SecurityCard />
        </TabsContent>
      </div>
    </Tabs>
  )
}
