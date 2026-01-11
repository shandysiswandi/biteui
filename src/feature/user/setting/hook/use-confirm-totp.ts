import { useCallback, useReducer } from "react"
import { toast } from "sonner"

import { useConfirmTotpMutation } from "@/feature/user/setting/service/confirm-totp"
import type { SetupTotpResponse } from "@/feature/user/setting/service/setup-totp"
import { notifyApiError } from "@/lib/utils/notify"

type UseConfirmTotpState = {
  otpCode: string
  setOtpCode: (value: string) => void
  isOtpReady: boolean
  isVerifying: boolean
  handleVerify: () => Promise<void>
}

export function useConfirmTotp(setupData: SetupTotpResponse | null): UseConfirmTotpState {
  const verifyTotpMutation = useConfirmTotpMutation()
  const challengeToken = setupData?.challenge_token ?? null
  const [otpState, dispatchOtp] = useReducer(otpReducer, {
    key: challengeToken,
    otpCode: "",
  })
  const isVerifying = verifyTotpMutation.isPending
  const isOtpStale = otpState.key !== challengeToken
  const otpCode = isOtpStale ? "" : otpState.otpCode
  const normalizedCode = otpCode.replace(/\D/g, "")
  const isOtpReady = normalizedCode.length === 6

  const setOtpCode = useCallback(
    (value: string) => {
      dispatchOtp({ type: "set", key: challengeToken, value })
    },
    [challengeToken],
  )

  const clearOtpCode = useCallback(() => {
    dispatchOtp({ type: "clear", key: challengeToken })
  }, [challengeToken])

  const handleVerify = async () => {
    if (isVerifying) {
      return
    }

    if (!challengeToken) {
      toast.error("Generate a setup key first")
      return
    }

    if (!isOtpReady) {
      toast.error("Enter the 6-digit code")
      return
    }

    try {
      await verifyTotpMutation.mutateAsync({
        challenge_token: challengeToken,
        code: normalizedCode,
      })
      toast.success("Authenticator enabled")
      clearOtpCode()
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

type OtpState = {
  key: string | null
  otpCode: string
}

type OtpAction =
  | { type: "set"; key: string | null; value: string }
  | { type: "clear"; key: string | null }

function otpReducer(state: OtpState, action: OtpAction): OtpState {
  switch (action.type) {
    case "set":
      return { key: action.key, otpCode: action.value }
    case "clear":
      return { key: action.key, otpCode: "" }
    default:
      return state
  }
}
