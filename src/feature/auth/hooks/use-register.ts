import { useState } from "react"
import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { ApiError } from "@/lib/api/error"
import { useZodForm } from "@/lib/hooks/use-zod-form"
import { notifyApiError } from "@/lib/utils/notify"

import { useRegisterMutation } from "../queries/use-register-mutation"

const unverifiedAccountMessage = "Account not verified"
const deactivatedAccountMessage = "Account deactivated"
const notAllowedAccountMessage = "Account not allowed"

const createRegisterSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(5, t("validation.name.invalid"))
      .max(100, t("validation.name.invalid"))
      .regex(/^[a-zA-Z\s]+$/, t("validation.name.invalid")),
    email: z.email(t("validation.email.invalid")),
    password: z
      .string()
      .min(8, t("validation.password.length"))
      .max(72, t("validation.password.length")),
  })

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>
export type RegisterResult = "created" | "unverified" | "deactivated" | "notAllowed"

export function useRegister() {
  const { t } = useTranslation()
  const registerSchema = createRegisterSchema(t)
  const registerMutation = useRegisterMutation()
  const form = useZodForm(registerSchema, {
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
  const isSubmitting = registerMutation.isPending
  const [registerResult, setRegisterResult] = useState<RegisterResult | null>(null)
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)
  const submit = form.handleSubmit(async (values) => {
    if (isSubmitting) {
      return
    }

    const email = values.email
    try {
      await registerMutation.mutateAsync({
        email,
        password: values.password,
        name: values.name,
      })

      setRegisterResult("created")
      setRegisteredEmail(email)
      toast.success(t("auth.toasts.registerSuccess"))
    } catch (error) {
      if (error instanceof ApiError) {
        const message = error.message.trim()
        const result =
          message === unverifiedAccountMessage
            ? "unverified"
            : message === deactivatedAccountMessage
              ? "deactivated"
              : message === notAllowedAccountMessage
                ? "notAllowed"
                : null
        if (result) {
          setRegisterResult(result)
          setRegisteredEmail(email)
          return
        }
      }
      notifyApiError(error)
    }
  })

  const continueWithGoogle = () => {
    toast.info(t("auth.toasts.oauthUnavailable", { provider: "Google" }))
  }

  return {
    form,
    isSubmitting,
    registerResult,
    registeredEmail,
    submit,
    continueWithGoogle,
  }
}
