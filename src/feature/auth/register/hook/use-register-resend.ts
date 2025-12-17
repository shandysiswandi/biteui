import { useCallback, useEffect, useRef, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"

import { useResendRegisterMutation } from "@/feature/auth/register/service/resend-register"
import { routes } from "@/lib/constants/routes"
import { notifyApiError } from "@/lib/utils/notify"

import type { RegisterFormValues } from "./use-register"

const resendBackoffSeconds = [60, 120, 240]

type UseRegisterResendParams = {
  form: UseFormReturn<RegisterFormValues>
  registeredEmail: string | null
}

export function useRegisterResend({
  form,
  registeredEmail,
}: UseRegisterResendParams) {
  const navigate = useNavigate()
  const location = useLocation()
  const resendMutation = useResendRegisterMutation()
  const [resendCount, setResendCount] = useState(0)
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0)
  const resendTimeoutRef = useRef<number | null>(null)
  const redirectTimeoutRef = useRef<number | null>(null)
  const isResending = resendMutation.isPending
  const hasReachedResendLimit = resendCount >= resendBackoffSeconds.length
  const canResend =
    !isResending && resendCooldownSeconds === 0 && !hasReachedResendLimit

  useEffect(() => {
    return () => {
      if (resendTimeoutRef.current !== null) {
        window.clearTimeout(resendTimeoutRef.current)
      }
      if (redirectTimeoutRef.current !== null) {
        window.clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [])

  const startResendCooldown = useCallback((seconds: number) => {
    if (resendTimeoutRef.current !== null) {
      window.clearTimeout(resendTimeoutRef.current)
    }

    if (seconds <= 0) {
      setResendCooldownSeconds(0)
      return
    }

    setResendCooldownSeconds(seconds)
    resendTimeoutRef.current = window.setTimeout(() => {
      setResendCooldownSeconds(0)
      resendTimeoutRef.current = null
    }, seconds * 1000)
  }, [])

  const scheduleRedirectToLogin = useCallback(
    (seconds: number) => {
      if (redirectTimeoutRef.current !== null) {
        window.clearTimeout(redirectTimeoutRef.current)
      }

      redirectTimeoutRef.current = window.setTimeout(
        () => {
          navigate(routes.auth.login, {
            replace: true,
            state: location.state,
          })
        },
        Math.max(0, seconds) * 1000,
      )
    },
    [location.state, navigate],
  )

  const handleResendVerification = useCallback(async () => {
    if (!canResend) {
      return
    }

    const email = (registeredEmail ?? form.getValues("email")).trim()
    if (!email) {
      toast.error("Enter a valid email")
      return
    }

    try {
      await resendMutation.mutateAsync({ email })

      const nextCount = resendCount + 1
      const backoffSeconds = resendBackoffSeconds[nextCount - 1] ?? 0

      setResendCount(nextCount)
      startResendCooldown(backoffSeconds)

      toast.success("Verification email resent")

      if (nextCount >= resendBackoffSeconds.length) {
        scheduleRedirectToLogin(backoffSeconds)
      }
    } catch (error) {
      notifyApiError(error)
    }
  }, [
    canResend,
    form,
    registeredEmail,
    resendCount,
    resendMutation,
    scheduleRedirectToLogin,
    startResendCooldown,
  ])

  return {
    canResend,
    isResending,
    resendCooldownSeconds,
    hasReachedResendLimit,
    handleResendVerification,
  }
}
