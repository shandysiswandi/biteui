import { useState } from "react"
import { toast } from "sonner"

import type { SetupTotpResponse } from "@/feature/me/setting/service/setup-totp"
import { useSetupTotpMutation } from "@/feature/me/setting/service/setup-totp"
import { notifyApiError } from "@/lib/utils/notify"

type UseSetupTotpState = {
  setupData: SetupTotpResponse | null
  isSettingUp: boolean
  hasSetup: boolean
  handleSetup: (friendlyName: string) => Promise<void>
  handleCopySecret: () => Promise<void>
}

export function useSetupTotp(): UseSetupTotpState {
  const setupTotpMutation = useSetupTotpMutation()
  const [setupData, setSetupData] = useState<SetupTotpResponse | null>(null)
  const isSettingUp = setupTotpMutation.isPending
  const hasSetup = Boolean(setupData)

  const handleSetup = async (friendlyName: string) => {
    if (isSettingUp || hasSetup) {
      return
    }

    const trimmedName = friendlyName.trim()
    if (!trimmedName) {
      toast.error("Friendly name is required")
      return
    }

    try {
      const data = await setupTotpMutation.mutateAsync({
        friendly_name: trimmedName,
      })
      setSetupData(data)
      toast.success("Setup key generated")
    } catch (error) {
      notifyApiError(error)
    }
  }

  const handleCopySecret = async () => {
    if (!setupData?.secret) {
      toast.error("Generate a setup key first")
      return
    }

    try {
      await navigator.clipboard.writeText(setupData.secret)
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
