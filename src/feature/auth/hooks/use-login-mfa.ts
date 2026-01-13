import { useCallback, useReducer } from "react"
import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"

import { routes } from "@/lib/constants/routes"
import { notifyApiError } from "@/lib/utils/notify"

import { useLoginMfaMutation } from "../queries/use-login-mfa-mutation"
import { usePreAuthStore } from "../stores/use-pre-auth-store"
import { getRedirectTo } from "../utils/redirect"

export function useLoginMfa() {
  const navigate = useNavigate()
  const location = useLocation()
  const loginMfaMutation = useLoginMfaMutation()
  const challengeToken = usePreAuthStore((state) => state.challengeToken)
  const preAuthEmail = usePreAuthStore((state) => state.preAuthEmail)
  const clearPreAuthSession = usePreAuthStore((state) => state.clearPreAuthSession)
  const [otpState, dispatchOtp] = useReducer(otpReducer, {
    key: challengeToken,
    otpCode: "",
  })
  const isVerifying = loginMfaMutation.isPending
  const isMfaRequired = Boolean(challengeToken)
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

  const submitMfa = async () => {
    if (isVerifying) {
      return
    }

    if (!challengeToken) {
      toast.error("Login session expired. Please sign in again.")
      return
    }

    if (!isOtpReady) {
      toast.error("Enter the 6-digit code")
      return
    }

    try {
      await loginMfaMutation.mutateAsync({
        challengeToken: challengeToken,
        method: "TOTP",
        code: normalizedCode,
      })

      clearPreAuthSession()
      clearOtpCode()
      toast.success("Logged in")
      navigate(
        getRedirectTo({ state: location.state, search: location.search }) ?? routes.dashboard,
        {
          replace: true,
        },
      )
    } catch (error) {
      notifyApiError(error, "Failed to verify the code")
    }
  }

  const resetMfa = () => {
    clearPreAuthSession()
    clearOtpCode()
  }

  return {
    isMfaRequired,
    preAuthEmail,
    otpCode,
    setOtpCode,
    isOtpReady,
    isVerifying,
    submitMfa,
    resetMfa,
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
