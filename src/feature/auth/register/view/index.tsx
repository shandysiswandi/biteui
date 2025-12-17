import { useRegister } from "../hook/use-register"
import { useRegisterResend } from "../hook/use-register-resend"
import { RegisterForm } from "./register-form"
import { RegisterSuccess } from "./register-success"

export default function Page() {
  const {
    form,
    isSubmitting,
    isSuccess,
    registerStatus,
    registeredEmail,
    submit,
    continueWithGoogle,
  } = useRegister()
  const {
    canResend,
    isResending,
    resendCooldownSeconds,
    hasReachedResendLimit,
    handleResendVerification,
  } = useRegisterResend({ form, registeredEmail })
  const emailValue = form.watch("email")
  const status = registerStatus ?? "Unverified"
  const displayEmail = registeredEmail ?? emailValue
  const resendCooldownMinutes = Math.ceil(resendCooldownSeconds / 60)
  const resendLabel = isResending
    ? "Sending..."
    : resendCooldownSeconds > 0
      ? `Resend available in ${resendCooldownMinutes} minute${resendCooldownMinutes === 1 ? "" : "s"}`
      : "Resend verification email"

  if (isSuccess) {
    return (
      <RegisterSuccess
        status={status}
        displayEmail={displayEmail}
        hasReachedResendLimit={hasReachedResendLimit}
        resendCooldownMinutes={resendCooldownMinutes}
        resendLabel={resendLabel}
        canResend={canResend}
        onResendVerification={handleResendVerification}
      />
    )
  }

  return (
    <RegisterForm
      form={form}
      isSubmitting={isSubmitting}
      onSubmit={submit}
      onContinueWithGoogle={continueWithGoogle}
    />
  )
}
