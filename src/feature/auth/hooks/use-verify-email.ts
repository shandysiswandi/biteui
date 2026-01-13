import { useEffect } from "react"
import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import { z } from "zod"

import { routes } from "@/lib/constants/routes"
import { useZodForm } from "@/lib/hooks/use-zod-form"

import { useVerifyEmailMutation } from "../queries/use-verify-email-mutation"

type VerifyStatus = "idle" | "verifying" | "invalid"

const tokenSchema = z.string().trim().min(50).max(70)
const createVerifyEmailSchema = (t: TFunction) =>
  z.object({
    email: z.email(t("validation.email.invalid")),
  })

export type VerifyEmailFormValues = z.infer<ReturnType<typeof createVerifyEmailSchema>>

export function useVerifyEmail() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isError, isPending, isSuccess, mutate } = useVerifyEmailMutation()
  const verifyEmailSchema = createVerifyEmailSchema(t)
  const form = useZodForm(verifyEmailSchema, {
    defaultValues: {
      email: "",
    },
  })

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
    if (isError) {
      toast.error(t("auth.toasts.verifyInvalid"))
    }
  }, [isError, t])

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("auth.toasts.verifySuccess"))
      navigate(routes.auth.login, { replace: true })
    }
  }, [isSuccess, navigate, t])

  useEffect(() => {
    if (status === "invalid" && token) {
      navigate(routes.auth.verifyEmail, { replace: true })
    }
  }, [navigate, status, token])

  const submit = form.handleSubmit(() => {
    if (!isTokenValid || isPending) {
      return
    }

    mutate({ challengeToken: token })
  })

  return {
    form,
    isInvalid: status === "invalid",
    isVerifying: status === "verifying" || isPending,
    submit,
  }
}
