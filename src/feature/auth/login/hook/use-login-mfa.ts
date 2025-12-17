import { useCallback, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"

import { useLoginMfaMutation } from "@/feature/auth/login/service/login-mfa"
import { usePreAuthStore } from "@/feature/auth/login/store/pre-auth-store"
import { routes } from "@/lib/constants/routes"
import { notifyApiError } from "@/lib/utils/notify"

import { getRedirectTo } from "./login-redirect"

export function useLoginMfa() {
  const navigate = useNavigate()
  const location = useLocation()
  const loginMfaMutation = useLoginMfaMutation()
  const challengeToken = usePreAuthStore((state) => state.challengeToken)
  const preAuthEmail = usePreAuthStore((state) => state.preAuthEmail)
  const clearPreAuthSession = usePreAuthStore(
    (state) => state.clearPreAuthSession,
  )
  const [otpState, setOtpState] = useState(() => ({
    token: challengeToken ?? null,
    code: "",
  }))
  const isVerifying = loginMfaMutation.isPending
  const isMfaRequired = Boolean(challengeToken)
  const currentToken = challengeToken ?? null
  const otpCode = otpState.token === currentToken ? otpState.code : ""
  const isOtpReady = otpCode.trim().length === 6
  const setOtpCode = useCallback(
    (value: string) => {
      setOtpState({ token: currentToken, code: value })
    },
    [currentToken],
  )

  const submitMfa = useCallback(async () => {
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
        challenge_token: challengeToken,
        code: otpCode.trim(),
      })

      clearPreAuthSession()
      setOtpCode("")
      toast.success("Logged in")
      navigate(getRedirectTo(location.state) ?? routes.dashboard, {
        replace: true,
      })
    } catch (error) {
      notifyApiError(error, "Failed to verify the code")
    }
  }, [
    isOtpReady,
    isVerifying,
    location.state,
    loginMfaMutation,
    navigate,
    otpCode,
    challengeToken,
    setOtpCode,
  ])

  const resetMfa = useCallback(() => {
    clearPreAuthSession()
    setOtpCode("")
  }, [clearPreAuthSession, setOtpCode])

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
