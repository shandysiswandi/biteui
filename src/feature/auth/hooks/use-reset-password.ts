import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import { z } from "zod"

import { routes } from "@/lib/constants/routes"
import { useZodForm } from "@/lib/hooks/use-zod-form"
import { notifyApiError } from "@/lib/utils/notify"

import { useResetPasswordMutation } from "../queries/use-reset-password-mutation"

const tokenSchema = z.string().trim().min(50).max(70)

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "New password must be 8-72 characters")
      .max(72, "New password must be 8-72 characters")
      .regex(/^\S+$/, "Password cannot contain spaces")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/\d/, "Password must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export function useResetPassword() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const resetPasswordMutation = useResetPasswordMutation()
  const [hasReset, setHasReset] = useState(false)
  const form = useZodForm(resetPasswordSchema, {
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const tokenResult = useMemo(
    () => tokenSchema.safeParse(searchParams.get("token") ?? ""),
    [searchParams],
  )
  const challengeToken = tokenResult.success ? tokenResult.data : ""
  const isTokenValid = tokenResult.success
  const isSubmitting = resetPasswordMutation.isPending

  const submit = form.handleSubmit(async (values) => {
    if (isSubmitting || !isTokenValid) {
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        challengeToken,
        newPassword: values.newPassword,
      })

      toast.success(t("auth.toasts.resetPasswordSuccess"))
      setHasReset(true)
    } catch (error) {
      notifyApiError(error)
    }
  })

  useEffect(() => {
    if (!isTokenValid) {
      return
    }

    form.clearErrors()
  }, [form, isTokenValid])

  useEffect(() => {
    if (!isTokenValid && searchParams.get("token")) {
      navigate(routes.auth.resetPassword, { replace: true })
    }
  }, [isTokenValid, navigate, searchParams])

  return {
    form,
    isInvalid: !isTokenValid,
    isSubmitting,
    hasReset,
    submit,
  }
}
