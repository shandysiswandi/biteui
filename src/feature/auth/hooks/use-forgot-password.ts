import { useState } from "react"
import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { useZodForm } from "@/lib/hooks/use-zod-form"
import { notifyApiError } from "@/lib/utils/notify"

import { useForgotPasswordMutation } from "../queries/use-forgot-password-mutation"

const createForgotPasswordSchema = (t: TFunction) =>
  z.object({
    email: z.email(t("validation.email.invalid")),
  })

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof createForgotPasswordSchema>>

export function useForgotPassword() {
  const { t } = useTranslation()
  const forgotPasswordSchema = createForgotPasswordSchema(t)
  const forgotPasswordMutation = useForgotPasswordMutation()
  const form = useZodForm(forgotPasswordSchema, {
    defaultValues: {
      email: "",
    },
  })
  const [hasSent, setHasSent] = useState(false)
  const isSubmitting = forgotPasswordMutation.isPending
  const submit = form.handleSubmit(async (values) => {
    if (isSubmitting) {
      return
    }

    try {
      await forgotPasswordMutation.mutateAsync({
        email: values.email,
      })

      toast.success(t("auth.toasts.forgotPasswordSuccess"))
      setHasSent(true)
    } catch (error) {
      notifyApiError(error)
    }
  })

  return {
    form,
    hasSent,
    isSubmitting,
    submit,
  }
}
