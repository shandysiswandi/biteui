import { useState } from "react"
import { toast } from "sonner"

import { useAuthProfile } from "@/lib/hooks/use-auth-profile"
import { notifyApiError } from "@/lib/utils/notify"

import type { SetupTotpOutput } from "../model/mfa"
import { useConfirmTotpMutation } from "../queries/use-confirm-totp-mutation"
import { useSetupTotpMutation } from "../queries/use-setup-totp-mutation"

export function useTotpSetup() {
  const user = useAuthProfile()
  const setupTotpMutation = useSetupTotpMutation()
  const confirmTotpMutation = useConfirmTotpMutation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [friendlyName, setFriendlyName] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [setupData, setSetupData] = useState<SetupTotpOutput | null>(null)
  const [showManualKey, setShowManualKey] = useState(false)
  const [otpCode, setOtpCode] = useState("")

  const defaultFriendlyName = user?.name?.trim() || user?.email || ""
  const otpNormalized = otpCode.replace(/\D/g, "")
  const isOtpReady = otpNormalized.length === 6

  const resetDialogState = () => {
    setFriendlyName(defaultFriendlyName)
    setCurrentPassword("")
    setSetupData(null)
    setShowManualKey(false)
    setOtpCode("")
  }

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetDialogState()
      return
    }
    resetDialogState()
  }

  const handleSetup = async () => {
    if (setupTotpMutation.isPending) {
      return
    }

    const trimmedName = friendlyName.trim()
    const trimmedPassword = currentPassword.trim()

    if (!trimmedName) {
      toast.error("Friendly name is required")
      return
    }
    if (!trimmedPassword) {
      toast.error("Current password is required")
      return
    }

    try {
      const response = await setupTotpMutation.mutateAsync({
        friendlyName: trimmedName,
        currentPassword: trimmedPassword,
      })
      setSetupData(response)
      setShowManualKey(false)
      setOtpCode("")
      toast.success("Setup key generated")
    } catch (error) {
      notifyApiError(error)
    }
  }

  const handleCopySecret = async () => {
    if (!setupData?.key) {
      toast.error("Generate a setup key first")
      return
    }
    if (!window.isSecureContext || !navigator.clipboard?.writeText) {
      toast.error("Clipboard access is unavailable")
      return
    }

    try {
      await navigator.clipboard.writeText(setupData.key)
      toast.success("Setup key copied")
    } catch (error) {
      notifyApiError(error, "Unable to copy the setup key")
    }
  }

  const handleVerify = async () => {
    if (confirmTotpMutation.isPending) {
      return
    }

    if (!setupData?.challengeToken) {
      toast.error("Generate a setup key first")
      return
    }

    if (!isOtpReady) {
      toast.error("Enter the 6-digit code")
      return
    }

    try {
      await confirmTotpMutation.mutateAsync({
        challengeToken: setupData.challengeToken,
        code: otpNormalized,
      })
      toast.success("Authenticator enabled")
      setIsDialogOpen(false)
    } catch (error) {
      notifyApiError(error)
    }
  }

  return {
    isAuthenticatorDialogOpen: isDialogOpen,
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
    isSetupPending: setupTotpMutation.isPending,
    isConfirmPending: confirmTotpMutation.isPending,
  }
}
