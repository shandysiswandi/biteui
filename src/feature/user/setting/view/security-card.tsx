import type { ReactNode } from "react"
import { useState } from "react"
import { Copy, KeyRound, QrCode, ShieldCheck } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import { useAuthStore } from "@/lib/stores/auth-store"
import { Badge } from "@/ui/components/base/badge"
import { Button } from "@/ui/components/base/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/base/card"
import { Input } from "@/ui/components/base/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/ui/components/base/input-group"
import { Label } from "@/ui/components/base/label"
import { PasswordInput } from "@/ui/components/base/password-input"

import { useConfirmTotp } from "../hook/use-confirm-totp"
import { useSetupTotp } from "../hook/use-setup-totp"

type SecurityBadge = {
  label: string
  className?: string
  variant?: "default" | "secondary" | "destructive" | "outline"
}

type SecurityOptionRowProps = {
  title: string
  description: string
  badges?: SecurityBadge[]
  checked: boolean
  disabled?: boolean
  hideAction?: boolean
  onCheckedChange: (checked: boolean) => void
  children?: ReactNode
}

function SecurityOptionRow({
  title,
  description,
  badges = [],
  checked,
  disabled = false,
  hideAction = false,
  onCheckedChange,
  children,
}: SecurityOptionRowProps) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{title}</p>
            {badges.map((badge) => (
              <Badge
                key={badge.label}
                variant={badge.variant ?? "secondary"}
                className={badge.className}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        {hideAction ? null : (
          <Button
            type="button"
            variant={checked ? "default" : "outline"}
            size="sm"
            disabled={disabled}
            onClick={() => onCheckedChange(!checked)}
            aria-label={`Edit ${title}`}
          >
            Edit
          </Button>
        )}
      </div>
      {checked && children ? <div className="border-t pt-4">{children}</div> : null}
    </div>
  )
}

export function SecurityCard() {
  const user = useAuthStore((state) => state.user)
  const { setupData, isSettingUp, hasSetup, handleSetup, handleCopySecret } = useSetupTotp()
  const { otpCode, setOtpCode, isOtpReady, isVerifying, handleVerify } = useConfirmTotp(setupData)
  const [isAuthenticatorEnabled, setIsAuthenticatorEnabled] = useState(false)
  const [showManualKey, setShowManualKey] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const friendlyName = user?.name?.trim() || user?.email || "Personal authenticator"
  const handleAuthenticatorToggle = (checked: boolean) => {
    setIsAuthenticatorEnabled(checked)
    setShowManualKey(false)
  }
  const handleGenerateSetup = async () => {
    await handleSetup(friendlyName, currentPassword)
  }
  const handleCancelSetup = () => {
    setIsAuthenticatorEnabled(false)
    setShowManualKey(false)
    setOtpCode("")
    setCurrentPassword("")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <CardTitle>Security</CardTitle>
            <CardDescription>Add extra protection to keep your account secure.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <SecurityOptionRow
          title="Authenticator app"
          description="Use time-based one-time passcodes when signing in."
          badges={[
            {
              label: "Recommended",
              variant: "outline",
              className:
                "border-green-200 bg-green-500/10 text-green-700 dark:border-green-500/40 dark:text-green-300",
            },
          ]}
          checked={isAuthenticatorEnabled}
          hideAction={isAuthenticatorEnabled}
          onCheckedChange={handleAuthenticatorToggle}
        >
          <div className="space-y-6">
            <p className="text-sm font-medium">
              {showManualKey
                ? "Step 1: Enter the secret code below in your authenticator app, then enter the 6-digit code from the app."
                : "Step 1: Scan the QR code using your authenticator app, then enter the 6-digit code from the app."}
            </p>

            {!hasSetup && (
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current password</Label>
                <PasswordInput
                  id="current-password"
                  autoComplete="current-password"
                  value={currentPassword}
                  disabled={isSettingUp}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleGenerateSetup}
                  disabled={isSettingUp || !currentPassword.trim()}
                >
                  {isSettingUp ? "Generating..." : "Generate setup key"}
                </Button>
              </div>
            )}

            <div className="space-y-4 rounded-lg p-4">
              {showManualKey ? (
                <div className="rounded-lg border bg-muted/40 p-4">
                  <div className="grid gap-2">
                    <Label htmlFor="otp-secret">Setup key</Label>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <KeyRound className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="otp-secret"
                        value={setupData?.key ?? ""}
                        placeholder="Setup key"
                        readOnly
                        aria-busy={isSettingUp}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={handleCopySecret}
                          disabled={!setupData?.key || isSettingUp}
                        >
                          <Copy className="size-3.5" />
                          Copy
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/40 mx-auto flex aspect-square w-full max-w-48 items-center justify-center rounded-lg border border-dashed">
                  {setupData?.uri ? (
                    <QRCodeSVG
                      value={setupData.uri}
                      size={256}
                      role="img"
                      aria-label="Authenticator app QR code"
                      className="bg-white h-auto w-full max-w-48 rounded-md p-4"
                    />
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center gap-2 text-sm">
                      <QrCode className="size-8" />
                      <span className="font-medium">Scan QR code</span>
                    </div>
                  )}
                </div>
              )}
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto w-full justify-center p-0 text-xs"
                onClick={() => setShowManualKey((value) => !value)}
              >
                {showManualKey ? "Show QR code instead" : "Having trouble scanning?"}
              </Button>
            </div>

            <p className="text-sm font-medium">Step 2: Enter your 6-digit code</p>

            <div className="grid gap-2">
              <Input
                id="otp-code"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(event) => {
                  const digitsOnly = event.target.value.replace(/\D/g, "")
                  setOtpCode(digitsOnly.slice(0, 6))
                }}
                disabled={!setupData?.challenge_token || isVerifying}
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelSetup}
                disabled={isVerifying}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleVerify}
                disabled={!setupData?.challenge_token || !isOtpReady || isVerifying}
              >
                Verify
              </Button>
            </div>
          </div>
        </SecurityOptionRow>
        <SecurityOptionRow
          title="SMS codes"
          description="Receive a one-time code via text message."
          badges={[{ label: "Less secure", variant: "destructive" }]}
          checked={false}
          disabled
          onCheckedChange={() => {}}
        />
        <SecurityOptionRow
          title="Passkey / security key"
          description="Sign in with built-in biometrics or hardware keys."
          checked={false}
          disabled
          onCheckedChange={() => {}}
        />
      </CardContent>
    </Card>
  )
}
