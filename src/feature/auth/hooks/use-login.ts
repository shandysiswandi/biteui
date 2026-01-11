import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"
import { z } from "zod"

import { routes } from "@/lib/constants/routes"
import { useZodForm } from "@/lib/hooks/use-zod-form"
import { notifyApiError, notifyOAuthUnavailable } from "@/lib/utils/notify"

import { useLoginMutation } from "../queries/use-login-mutation"
import { getRedirectTo } from "../utils/redirect"

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const loginMutation = useLoginMutation()
  const form = useZodForm(loginSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const isSubmitting = loginMutation.isPending

  const submit = form.handleSubmit(async (values) => {
    if (isSubmitting) {
      return
    }

    try {
      const result = await loginMutation.mutateAsync({ ...values })

      if (result.mfaRequired) {
        if (!result.challengeToken) {
          toast.error("MFA token missing. Please sign in again.")
          return
        }

        return
      }

      if (!result.accessToken || !result.refreshToken) {
        toast.error("Login session missing. Please try again.")
        return
      }

      toast.success("Logged in")
      navigate(getRedirectTo(location.state) ?? routes.dashboard, {
        replace: true,
      })
    } catch (error) {
      notifyApiError(error)
    }
  })

  const continueWithGoogle = () => {
    notifyOAuthUnavailable("Google")
  }

  return {
    form,
    isSubmitting,
    submit,
    continueWithGoogle,
  }
}
