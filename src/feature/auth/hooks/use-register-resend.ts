import { useCallback, useEffect, useReducer, useRef } from "react"
import type { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import { notifyApiError } from "@/lib/utils/notify"

import { useResendRegisterMutation } from "../queries/use-resend-register-mutation"
import type { RegisterFormValues } from "./use-register"

const resendBackoffSeconds = [60, 120, 240]

type UseRegisterResendParams = {
  form: UseFormReturn<RegisterFormValues>
  registeredEmail: string | null
}

export function useRegisterResend({ form, registeredEmail }: UseRegisterResendParams) {
  const resendMutation = useResendRegisterMutation()
  const resendKey = registeredEmail ?? ""
  const [resendState, dispatchResend] = useReducer(resendReducer, {
    key: resendKey,
    resendCount: 0,
    resendCooldownSeconds: 0,
  })
  const resendTimeoutRef = useRef<number | null>(null)
  const resendIntervalRef = useRef<number | null>(null)
  const isResending = resendMutation.isPending
  const isResendStale = resendState.key !== resendKey
  const resendCount = isResendStale ? 0 : resendState.resendCount
  const resendCooldownSeconds = isResendStale ? 0 : resendState.resendCooldownSeconds
  const hasReachedResendLimit = resendCount >= resendBackoffSeconds.length
  const canResend = !isResending && resendCooldownSeconds === 0 && !hasReachedResendLimit

  useEffect(() => {
    return () => {
      if (resendTimeoutRef.current !== null) {
        window.clearTimeout(resendTimeoutRef.current)
      }
      if (resendIntervalRef.current !== null) {
        window.clearInterval(resendIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (resendTimeoutRef.current !== null) {
      window.clearTimeout(resendTimeoutRef.current)
      resendTimeoutRef.current = null
    }
    if (resendIntervalRef.current !== null) {
      window.clearInterval(resendIntervalRef.current)
      resendIntervalRef.current = null
    }
  }, [registeredEmail])

  const startResendCooldown = useCallback(
    (seconds: number) => {
      if (resendTimeoutRef.current !== null) {
        window.clearTimeout(resendTimeoutRef.current)
      }
      if (resendIntervalRef.current !== null) {
        window.clearInterval(resendIntervalRef.current)
        resendIntervalRef.current = null
      }

      if (seconds <= 0) {
        dispatchResend({ type: "set-cooldown", key: resendKey, value: 0 })
        return
      }

      dispatchResend({ type: "set-cooldown", key: resendKey, value: seconds })
      resendIntervalRef.current = window.setInterval(() => {
        dispatchResend({ type: "tick-cooldown", key: resendKey })
      }, 1000)
      resendTimeoutRef.current = window.setTimeout(() => {
        dispatchResend({ type: "set-cooldown", key: resendKey, value: 0 })
        resendTimeoutRef.current = null
        if (resendIntervalRef.current !== null) {
          window.clearInterval(resendIntervalRef.current)
          resendIntervalRef.current = null
        }
      }, seconds * 1000)
    },
    [resendKey],
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

      dispatchResend({ type: "set-count", key: resendKey, value: nextCount })
      startResendCooldown(backoffSeconds)

      toast.success("Verification email resent")
    } catch (error) {
      notifyApiError(error)
    }
  }, [
    canResend,
    form,
    registeredEmail,
    resendCount,
    resendKey,
    resendMutation,
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

type ResendState = {
  key: string
  resendCount: number
  resendCooldownSeconds: number
}

type ResendAction =
  | { type: "set-count"; key: string; value: number }
  | { type: "set-cooldown"; key: string; value: number }
  | { type: "tick-cooldown"; key: string }

function resendReducer(state: ResendState, action: ResendAction): ResendState {
  switch (action.type) {
    case "set-count":
      return {
        key: action.key,
        resendCount: action.value,
        resendCooldownSeconds: state.resendCooldownSeconds,
      }
    case "set-cooldown":
      return {
        key: action.key,
        resendCount: state.resendCount,
        resendCooldownSeconds: action.value,
      }
    case "tick-cooldown":
      if (state.key !== action.key) {
        return state
      }
      return {
        ...state,
        resendCooldownSeconds: Math.max(0, state.resendCooldownSeconds - 1),
      }
    default:
      return state
  }
}
