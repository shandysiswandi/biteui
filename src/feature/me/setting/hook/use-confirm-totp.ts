import { useState } from "react"
import { toast } from "sonner"

import { useConfirmTotpMutation } from "@/feature/me/setting/service/confirm-totp"
import type { SetupTotpResponse } from "@/feature/me/setting/service/setup-totp"
import { notifyApiError } from "@/lib/utils/notify"

type UseConfirmTotpState = {
  otpCode: string
  setOtpCode: (value: string) => void
  isOtpReady: boolean
  isVerifying: boolean
  handleVerify: () => Promise<void>
}

export function useConfirmTotp(
  setupData: SetupTotpResponse | null,
): UseConfirmTotpState {
  const verifyTotpMutation = useConfirmTotpMutation()
  const [otpState, setOtpState] = useState(() => ({
    token: setupData?.challenge_token ?? null,
    code: "",
  }))
  const currentToken = setupData?.challenge_token ?? null
  const otpCode = otpState.token === currentToken ? otpState.code : ""
  const setOtpCode = (value: string) => {
    setOtpState({ token: currentToken, code: value })
  }
  const isVerifying = verifyTotpMutation.isPending
  const isOtpReady = otpCode.trim().length === 6

  const handleVerify = async () => {
    if (isVerifying) {
      return
    }

    if (!setupData?.challenge_token) {
      toast.error("Generate a setup key first")
      return
    }

    if (!isOtpReady) {
      toast.error("Enter the 6-digit code")
      return
    }

    try {
      await verifyTotpMutation.mutateAsync({
        challenge_token: setupData.challenge_token,
        code: otpCode,
      })
      toast.success("Authenticator enabled")
      setOtpCode("")
    } catch (error) {
      notifyApiError(error)
    }
  }

  return {
    otpCode,
    setOtpCode,
    isOtpReady,
    isVerifying,
    handleVerify,
  }
}
