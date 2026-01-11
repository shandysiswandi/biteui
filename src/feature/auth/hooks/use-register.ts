import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { ApiError } from "@/lib/api/error"
import { useZodForm } from "@/lib/hooks/use-zod-form"
import { notifyApiError, notifyOAuthUnavailable } from "@/lib/utils/notify"

import { useRegisterMutation } from "../queries/use-register-mutation"

const unverifiedAccountMessage = "Account not verified"
const deactivatedAccountMessage = "Account deactivated"
const notAllowedAccountMessage = "Account not allowed"

const registerSchema = z.object({
  name: z.string().trim().min(5, "Please enter a valid name"),
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
export type RegisterResult = "created" | "unverified" | "deactivated" | "notAllowed"

export function useRegister() {
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
      toast.success("Account created. Please verify your email.")
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
    notifyOAuthUnavailable("Google")
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
