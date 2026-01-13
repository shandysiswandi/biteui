import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"
import { z } from "zod"

import { routes } from "@/lib/constants/routes"
import { useZodForm } from "@/lib/hooks/use-zod-form"
import { notifyApiError } from "@/lib/utils/notify"

import { useLoginMutation } from "../queries/use-login-mutation"
import { getRedirectTo } from "../utils/redirect"

const createLoginSchema = (t: TFunction) =>
  z.object({
    email: z.email(t("validation.email.invalid")),
    password: z.string().min(1, t("validation.password.required")),
  })

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>

export function useLogin() {
  const { t } = useTranslation()
  const loginSchema = createLoginSchema(t)
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
          toast.error(t("auth.toasts.mfaTokenMissing"))
          return
        }

        return
      }

      if (!result.accessToken || !result.refreshToken) {
        toast.error(t("auth.toasts.sessionMissing"))
        return
      }

      toast.success(t("auth.toasts.loginSuccess"))
      navigate(
        getRedirectTo({ state: location.state, search: location.search }) ?? routes.dashboard,
        {
          replace: true,
        },
      )
    } catch (error) {
      notifyApiError(error)
    }
  })

  const continueWithGoogle = () => {
    toast.info(t("auth.toasts.oauthUnavailable", { provider: "Google" }))
  }

  return {
    form,
    isSubmitting,
    submit,
    continueWithGoogle,
  }
}
