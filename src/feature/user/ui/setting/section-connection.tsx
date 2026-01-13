"use client"

import { useState } from "react"
import { Check, Cloud, Globe } from "lucide-react"

import { cn } from "@/lib/utils/tailwind"
import { Badge } from "@/ui/components/base/badge"
import { Button } from "@/ui/components/base/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/base/card"
import { Separator } from "@/ui/components/base/separator"
import { Apple } from "@/ui/components/logo/apple"
import { Github } from "@/ui/components/logo/github"
import { Google } from "@/ui/components/logo/google"

export function SectionConnection() {
  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Connected Accounts</h3>
        <p className="text-sm text-muted-foreground">
          Connect your account to third-party services to enable faster login and data syncing.
        </p>
      </div>

      <Separator />

      {/* --- PROVIDERS LIST --- */}
      <div className="grid gap-2">
        {/* GOOGLE (Connected State) */}
        <ConnectionCard
          icon={<Google />}
          name="Google"
          description="Use your Google account to sign in and sync calendar events."
          connected={true}
          accountName="user@example.com"
          connectedDate="Connected on Jan 12, 2024"
          scopes={["email", "profile", "calendar.readonly"]}
        />

        {/* GITHUB (Connected State) */}
        <ConnectionCard
          icon={<Github />}
          name="GitHub"
          description="Sync repositories and manage deployments."
          connected={true}
          accountName="octocat"
          connectedDate="Connected on Feb 20, 2024"
          scopes={["read:user", "repo", "workflow"]}
        />

        {/* APPLE (Disconnected State) */}
        <ConnectionCard
          icon={<Apple />}
          name="Apple"
          description="Sign in with your Apple ID for enhanced privacy."
          connected={false}
        />
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS ---

type ConnectionCardProps = {
  icon: React.ReactNode
  name: string
  description: string
  connected: boolean
  accountName?: string
  connectedDate?: string
  scopes?: string[]
}

function ConnectionCard({
  icon,
  name,
  description,
  connected,
  accountName,
  connectedDate,
  scopes,
}: ConnectionCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500) // Fake API delay
  }

  return (
    <Card
      className={cn(
        "p-0 overflow-hidden transition-all",
        connected ? "border-primary/20 bg-muted/10" : "",
      )}
    >
      <CardHeader className="grid grid-cols-[1fr_auto] items-start p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm">
            {icon}
          </div>
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              {name}
              {connected && (
                <Badge
                  variant="secondary"
                  className="gap-1 font-normal text-primary bg-primary/10 hover:bg-primary/20"
                >
                  <Check className="h-3 w-3" /> Connected
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="max-w-sm">{description}</CardDescription>

            {connected && (
              <div className="pt-2 text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  <span className="font-medium text-foreground">{accountName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="h-3 w-3" />
                  <span>{connectedDate}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <Button
          variant={connected ? "outline" : "default"}
          size="sm"
          className={cn(
            connected &&
              "border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive",
          )}
          onClick={handleAction}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="animate-pulse">Processing...</span>
          ) : connected ? (
            "Disconnect"
          ) : (
            "Connect"
          )}
        </Button>
      </CardHeader>

      {/* Detailed permissions view for connected accounts */}
      {connected && scopes && scopes.length > 0 && (
        <CardContent className="border-t bg-muted/20 p-4 text-xs">
          <p className="mb-2 font-medium text-muted-foreground">Permissions granted:</p>
          <div className="flex flex-wrap gap-2">
            {scopes.map((scope) => (
              <Badge
                key={scope}
                variant="outline"
                className="bg-background text-muted-foreground font-mono text-[10px]"
              >
                {scope}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
