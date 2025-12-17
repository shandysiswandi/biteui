import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { useForgotPasswordMutation } from "@/feature/auth/forgot-password/service/forgot-password"
import { useZodForm } from "@/lib/hooks/use-zod-form"
import { notifyApiError } from "@/lib/utils/notify"

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email"),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function useForgotPassword() {
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
        email: values.email.trim(),
      })

      toast.success("Check your email for reset instructions")
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
