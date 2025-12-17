import { useCallback, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import {
  useRegisterMutation,
  type RegisterStatus,
} from "@/feature/auth/register/service/register"
import { useZodForm } from "@/lib/hooks/use-zod-form"
import { notifyApiError, notifyOAuthUnavailable } from "@/lib/utils/notify"

const registerSchema = z.object({
  full_name: z.string().min(5, "Please enter a valid name"),
  email: z.email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "New password must be 8-72 characters")
    .max(72, "New password must be 8-72 characters")
    .regex(/^\S+$/, "Password cannot contain spaces")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/\d/, "Password must include at least one number"),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export function useRegister() {
  const registerMutation = useRegisterMutation()
  const form = useZodForm(registerSchema, {
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
    },
  })
  const isSubmitting = registerMutation.isPending
  const isSuccess = registerMutation.isSuccess
  const [registerStatus, setRegisterStatus] = useState<RegisterStatus | null>(
    null,
  )
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)
  const submit = form.handleSubmit(async (values) => {
    if (isSubmitting) {
      return
    }

    try {
      await registerMutation.mutateAsync({
        email: values.email.trim(),
        password: values.password.trim(),
        full_name: values.full_name.trim(),
      })

      setRegisterStatus("Unverified")
      setRegisteredEmail(values.email.trim())
      toast.success("Account created. Please verify your email.")
    } catch (error) {
      notifyApiError(error)
    }
  })

  const continueWithGoogle = useCallback(() => {
    notifyOAuthUnavailable("Google")
  }, [])

  return {
    form,
    isSubmitting,
    isSuccess,
    registerStatus,
    registeredEmail,
    submit,
    continueWithGoogle,
  }
}
