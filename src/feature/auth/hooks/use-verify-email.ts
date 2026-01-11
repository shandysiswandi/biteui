import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import { z } from "zod"

import { routes } from "@/lib/constants/routes"

import { useVerifyEmailMutation } from "../queries/use-verify-email-mutation"

type VerifyStatus = "idle" | "verifying" | "invalid"

const tokenSchema = z.string().trim().min(50).max(70)

export function useVerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isError, isPending, isSuccess, mutate } = useVerifyEmailMutation()

  const tokenResult = tokenSchema.safeParse(searchParams.get("token") ?? "")
  const token = tokenResult.success ? tokenResult.data : ""
  const isTokenValid = tokenResult.success
  const status: VerifyStatus = !isTokenValid
    ? "invalid"
    : isError
      ? "invalid"
      : isPending
        ? "verifying"
        : "idle"

  useEffect(() => {
    if (!isTokenValid) {
      return
    }

    mutate({ challengeToken: token })
  }, [isTokenValid, mutate, token])

  useEffect(() => {
    if (isError) {
      toast.error("Verification link is invalid or expired.")
    }
  }, [isError])

  useEffect(() => {
    if (isSuccess) {
      toast.success("Your email has been verified. You can now log in.")
      navigate(routes.auth.login, { replace: true })
    }
  }, [isSuccess, navigate])

  useEffect(() => {
    if (status === "invalid" && token) {
      navigate(routes.auth.verifyEmail, { replace: true })
    }
  }, [navigate, status, token])

  return {
    isInvalid: status === "invalid",
    isVerifying: status === "verifying" || isPending,
  }
}
