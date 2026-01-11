import { useTranslation } from "react-i18next"

import { useForgotPassword } from "../../hooks/use-forgot-password"
import { ForgotPasswordForm } from "./forgot-password-form"
import { ForgotPasswordSuccess } from "./forgot-password-success"

export default function Page() {
  const { t } = useTranslation()
  const { form, hasSent, isSubmitting, submit } = useForgotPassword()
  const emailValue = form.watch("email")
  const submitLabel = isSubmitting
    ? t("auth.forgotPassword.submitting")
    : hasSent
      ? t("auth.forgotPassword.submitResend")
      : t("auth.forgotPassword.submitSend")

  if (hasSent) {
    return <ForgotPasswordSuccess email={emailValue} />
  }

  return (
    <ForgotPasswordForm
      form={form}
      isSubmitting={isSubmitting}
      submitLabel={submitLabel}
      onSubmit={submit}
    />
  )
}
