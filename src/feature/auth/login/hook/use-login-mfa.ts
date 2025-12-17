import { useCallback, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"

import { useLoginMfaMutation } from "@/feature/auth/login/service/login-mfa"
import { routes } from "@/lib/constants/routes"
import { useAuthStore } from "@/lib/stores/auth-store"
import { notifyApiError } from "@/lib/utils/notify"

import { getRedirectTo } from "./login-redirect"

export function useLoginMfa() {
  const navigate = useNavigate()
  const location = useLocation()
  const loginMfaMutation = useLoginMfaMutation()
  const challengeId = useAuthStore((state) => state.challenge_id)
  const preAuthEmail = useAuthStore((state) => state.preAuthEmail)
  const clearPreAuthSession = useAuthStore((state) => state.clearPreAuthSession)
  const [otpState, setOtpState] = useState(() => ({
    token: challengeId ?? null,
    code: "",
  }))
  const isVerifying = loginMfaMutation.isPending
  const isMfaRequired = Boolean(challengeId)
  const currentToken = challengeId ?? null
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

    if (!challengeId) {
      toast.error("Login session expired. Please sign in again.")
      return
    }

    if (!isOtpReady) {
      toast.error("Enter the 6-digit code")
      return
    }

    try {
      await loginMfaMutation.mutateAsync({
        challenge_id: challengeId,
        code: otpCode.trim(),
      })

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
    challengeId,
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
