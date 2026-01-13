"use client"

import {
  AlertTriangle,
  Copy,
  FileDigit,
  Fingerprint,
  KeyRound,
  Laptop,
  MessageSquare,
  QrCode,
  Shield,
  Smartphone,
  type LucideIcon,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import { Badge } from "@/ui/components/base/badge"
import { Button } from "@/ui/components/base/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/base/dialog"
import { Input } from "@/ui/components/base/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/ui/components/base/input-group"
import { Label } from "@/ui/components/base/label"
import { PasswordInput } from "@/ui/components/base/password-input"
import { Separator } from "@/ui/components/base/separator"

import { useSectionSecurity } from "../../hooks/use-section-security"

export function SectionSecurity() {
  const {
    isSettingLoading,
    isAuthenticatorEnabled,
    isSmsEnabled,
    isBackupCodeEnabled,
    authenticatorButtonLabel,
    backupCodesButtonLabel,
    isAuthenticatorDialogOpen,
    handleDialogChange,
    friendlyName,
    setFriendlyName,
    currentPassword,
    setCurrentPassword,
    setupData,
    showManualKey,
    setShowManualKey,
    otpCode,
    setOtpCode,
    isOtpReady,
    handleSetup,
    handleCopySecret,
    handleVerify,
    isSetupPending,
    isConfirmPending,
    isBackupDialogOpen,
    handleBackupDialogChange,
    backupPassword,
    setBackupPassword,
    backupCodes,
    backupCodesPreview,
    isBackupViewOnly,
    showBackupPasswordForm,
    handleGenerateBackupCodes,
    handleStartBackupRegenerate,
    handleCopyBackupCodes,
    handleDownloadBackupCodes,
    handlePrintBackupCodes,
    isBackupPending,
  } = useSectionSecurity()

  return (
    <div className="space-y-8">
      {/* --- MULTI-FACTOR AUTHENTICATION --- */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Multi-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account.
          </p>
        </div>

        <div className="rounded-lg border divide-y">
          {/* 1. Authenticator App */}
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-muted p-2 rounded-full">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">Authenticator App</p>
                  {isAuthenticatorEnabled ? (
                    <Badge
                      variant="outline"
                      className="border-green-500/30 text-green-600 bg-green-500/10"
                    >
                      Enabled
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Use an app like Google Authenticator or Authy to generate verification codes.
                </p>
              </div>
            </div>
            <Dialog open={isAuthenticatorDialogOpen} onOpenChange={handleDialogChange}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" disabled={isSettingLoading}>
                  {authenticatorButtonLabel}
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-xl"
                onEscapeKeyDown={(event) => event.preventDefault()}
                onPointerDownOutside={(event) => event.preventDefault()}
                onInteractOutside={(event) => event.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Enable authenticator app</DialogTitle>
                  <DialogDescription>
                    Add an app-based code to secure your account.
                  </DialogDescription>
                </DialogHeader>

                {setupData ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-sm font-medium">
                        {showManualKey
                          ? "Step 1: Enter this setup key in your authenticator app."
                          : "Step 1: Scan the QR code with your authenticator app."}
                      </p>
                      {showManualKey ? (
                        <div className="rounded-lg border bg-muted/40 p-4">
                          <div className="grid gap-2">
                            <Label htmlFor="totp-secret">Setup key</Label>
                            <InputGroup>
                              <InputGroupAddon align="inline-start">
                                <KeyRound className="size-4" />
                              </InputGroupAddon>
                              <InputGroupInput id="totp-secret" value={setupData.key} readOnly />
                              <InputGroupAddon align="inline-end">
                                <InputGroupButton onClick={handleCopySecret}>
                                  <Copy className="size-3.5" />
                                  Copy
                                </InputGroupButton>
                              </InputGroupAddon>
                            </InputGroup>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-muted/40 mx-auto flex aspect-square w-full max-w-52 items-center justify-center rounded-lg border border-dashed">
                          {setupData.uri ? (
                            <QRCodeSVG
                              value={setupData.uri}
                              size={256}
                              role="img"
                              aria-label="Authenticator app QR code"
                              className="bg-white h-auto w-full max-w-52 rounded-md p-4"
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

                    <div className="space-y-3">
                      <p className="text-sm font-medium">Step 2: Enter your 6-digit code</p>
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
                        disabled={isConfirmPending}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="friendly-name">Friendly name</Label>
                      <Input
                        id="friendly-name"
                        value={friendlyName}
                        placeholder="Personal authenticator"
                        onChange={(event) => setFriendlyName(event.target.value)}
                        disabled={isSetupPending}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Current password</Label>
                      <PasswordInput
                        id="current-password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        disabled={isSetupPending}
                      />
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogChange(false)}
                    disabled={isSetupPending || isConfirmPending}
                  >
                    Cancel
                  </Button>
                  {setupData ? (
                    <Button
                      type="button"
                      onClick={handleVerify}
                      disabled={!isOtpReady || isConfirmPending}
                    >
                      Verify
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleSetup} disabled={isSetupPending}>
                      {isSetupPending ? "Setting up..." : "Setup"}
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* 2. SMS Authentication */}
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-muted p-2 rounded-full">
                <MessageSquare className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">SMS / Text Message</p>
                  <Badge
                    variant="secondary"
                    className="px-1.5"
                    title="We strongly advise against using SMS because it is susceptible to interception, does not provide resistance against phishing attacks, and deliverability can be unreliable. It is recommended to use an Authenticator app instead of SMS."
                  >
                    Less Secure
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Receive verification codes via SMS. Useful as a fallback method.
                </p>
              </div>
            </div>

            {isSmsEnabled ? (
              <Badge
                variant="outline"
                className="border-green-500/30 text-green-600 bg-green-500/10"
              >
                Enabled
              </Badge>
            ) : (
              <Button size="sm" variant="outline" disabled={isSettingLoading}>
                Add
              </Button>
            )}
          </div>

          {/* 3. Security Keys */}
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-muted p-2 rounded-full">
                <Fingerprint className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Security Keys</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Use a physical key or your device's biometrics for the most secure login.
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" disabled>
              Add
            </Button>
          </div>

          {/* 4. Backup Codes */}
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-muted p-2 rounded-full">
                <FileDigit className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">Backup Codes</p>
                  {isBackupCodeEnabled ? (
                    <Badge
                      variant="outline"
                      className="border-green-500/30 text-green-600 bg-green-500/10"
                    >
                      Enabled
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Generate a set of one-time codes to access your account if you lose your device.
                </p>
              </div>
            </div>
            <Dialog open={isBackupDialogOpen} onOpenChange={handleBackupDialogChange}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" disabled={isSettingLoading}>
                  {backupCodesButtonLabel}
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-xl"
                onEscapeKeyDown={(event) => event.preventDefault()}
                onPointerDownOutside={(event) => event.preventDefault()}
                onInteractOutside={(event) => event.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Backup codes</DialogTitle>
                  <DialogDescription>
                    Generate a set of one-time codes for account recovery.
                  </DialogDescription>
                </DialogHeader>

                {backupCodes || (isBackupViewOnly && !showBackupPasswordForm) ? (
                  <div className="space-y-4">
                    {backupCodes ? (
                      <div className="rounded-lg border bg-muted/40 p-4">
                        <p className="text-sm text-muted-foreground">
                          Save these recovery codes in a safe place. If you close this dialog you
                          will never show this again.
                        </p>
                      </div>
                    ) : null}

                    <div className="grid gap-2">
                      <div className="rounded-lg border bg-muted/20 p-4 font-mono text-sm tracking-wide whitespace-pre-wrap">
                        {backupCodes
                          ? backupCodes.recoveryCodes.join("\n")
                          : backupCodesPreview.join("\n")}
                      </div>
                      {backupCodes && (
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={handleCopyBackupCodes}>
                            Copy
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleDownloadBackupCodes}>
                            Download
                          </Button>
                          <Button size="sm" variant="outline" onClick={handlePrintBackupCodes}>
                            Print
                          </Button>
                        </div>
                      )}
                    </div>
                    {isBackupViewOnly ? (
                      <Button size="sm" variant="outline" onClick={handleStartBackupRegenerate}>
                        Generate new recovery
                      </Button>
                    ) : null}
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="backup-current-password">Current password</Label>
                    <PasswordInput
                      id="backup-current-password"
                      autoComplete="current-password"
                      value={backupPassword}
                      onChange={(event) => setBackupPassword(event.target.value)}
                      disabled={isBackupPending}
                    />
                  </div>
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleBackupDialogChange(false)}
                    disabled={isBackupPending}
                  >
                    Close
                  </Button>
                  {backupCodes || (isBackupViewOnly && !showBackupPasswordForm) ? null : (
                    <Button
                      type="button"
                      onClick={handleGenerateBackupCodes}
                      disabled={isBackupPending}
                    >
                      {isBackupPending ? "Generating..." : "Add"}
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Separator />

      {/* --- ACTIVE SESSIONS --- */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Active Sessions</h3>
          <p className="text-sm text-muted-foreground">
            Manage the devices currently logged into your account.
          </p>
        </div>

        <div className="rounded-lg border divide-y">
          <SessionRow
            icon={Laptop}
            device="Chrome on macOS"
            location="Jakarta, Indonesia"
            ip="192.168.1.1"
            lastActive="Current Session"
            isCurrent
          />
          <SessionRow
            icon={Smartphone}
            device="Safari on iPhone 15"
            location="Jakarta, Indonesia"
            ip="10.0.0.45"
            lastActive="Active 2 hours ago"
          />
        </div>
      </div>

      <Separator />

      {/* --- DANGER ZONE --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-5" />
          <h3 className="text-lg font-medium">Danger Zone</h3>
        </div>

        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground max-w-md">
                Permanently delete your account and all associated data. This action cannot be
                undone.
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function SessionRow({
  icon: Icon,
  device,
  location,
  ip,
  lastActive,
  isCurrent,
}: {
  icon: LucideIcon
  device: string
  location: string
  ip: string
  lastActive: string
  isCurrent?: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-start gap-4">
        <div className="mt-1 bg-muted p-2 rounded-lg">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{device}</p>
            {isCurrent && (
              <Badge
                variant="secondary"
                className="text-[10px] h-5 px-1.5 bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
              >
                Current
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {location} • {ip}
          </p>
          <p className="text-xs text-muted-foreground">{lastActive}</p>
        </div>
      </div>
      {!isCurrent && (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          Revoke
        </Button>
      )}
    </div>
  )
}
