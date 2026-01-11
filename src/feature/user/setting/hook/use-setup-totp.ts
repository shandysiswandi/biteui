import { useState } from "react"
import { toast } from "sonner"

import type { SetupTotpResponse } from "@/feature/user/setting/service/setup-totp"
import { useSetupTotpMutation } from "@/feature/user/setting/service/setup-totp"
import { notifyApiError } from "@/lib/utils/notify"

type UseSetupTotpState = {
  setupData: SetupTotpResponse | null
  isSettingUp: boolean
  hasSetup: boolean
  handleSetup: (friendlyName: string, currentPassword: string) => Promise<void>
  handleCopySecret: () => Promise<void>
}

export function useSetupTotp(): UseSetupTotpState {
  const setupTotpMutation = useSetupTotpMutation()
  const [setupData, setSetupData] = useState<SetupTotpResponse | null>(null)
  const isSettingUp = setupTotpMutation.isPending
  const hasSetup = Boolean(setupData)

  const handleSetup = async (friendlyName: string, currentPassword: string) => {
    if (isSettingUp || hasSetup) {
      return
    }

    const trimmedName = friendlyName.trim()
    if (!trimmedName) {
      toast.error("Friendly name is required")
      return
    }
    if (!currentPassword.trim()) {
      toast.error("Current password is required")
      return
    }

    try {
      const data = await setupTotpMutation.mutateAsync({
        friendly_name: trimmedName,
        current_password: currentPassword.trim(),
      })
      setSetupData(data)
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

  return {
    setupData,
    isSettingUp,
    hasSetup,
    handleSetup,
    handleCopySecret,
  }
}
