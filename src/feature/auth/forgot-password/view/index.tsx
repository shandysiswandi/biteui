import { useForgotPassword } from "../hook/use-forgot-password"
import { ForgotPasswordForm } from "./forgot-password-form"
import { ForgotPasswordSuccess } from "./forgot-password-success"

export default function Page() {
  const { form, hasSent, isSubmitting, submit } = useForgotPassword()
  const emailValue = form.watch("email")
  const submitLabel = isSubmitting
    ? "Sending..."
    : hasSent
      ? "Resend reset email"
      : "Send reset email"

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
