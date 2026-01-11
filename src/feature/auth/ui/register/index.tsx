import { useRegister } from "../../hooks/use-register"
import { useRegisterResend } from "../../hooks/use-register-resend"
import { RegisterForm } from "./register-form"
import { RegisterSuccess } from "./register-success"

const formatResendCooldown = (seconds: number) => {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60)
    const remainder = seconds % 60

    return `${minutes}:${String(remainder).padStart(2, "0")}`
  }

  return `${seconds}s`
}

export default function Page() {
  const { form, isSubmitting, registerResult, registeredEmail, submit, continueWithGoogle } =
    useRegister()
  const {
    canResend,
    isResending,
    resendCooldownSeconds,
    hasReachedResendLimit,
    handleResendVerification,
  } = useRegisterResend({ form, registeredEmail })

  if (!registerResult) {
    return (
      <RegisterForm
        form={form}
        isSubmitting={isSubmitting}
        onSubmit={submit}
        onContinueWithGoogle={continueWithGoogle}
      />
    )
  }

  const displayEmail = registeredEmail ?? form.getValues("email")
  const resendLabel = isResending
    ? "Sending..."
    : resendCooldownSeconds > 0
      ? `Resend available in ${formatResendCooldown(resendCooldownSeconds)}`
      : "Resend verification email"

  return (
    <RegisterSuccess
      result={registerResult}
      displayEmail={displayEmail}
      hasReachedResendLimit={hasReachedResendLimit}
      resendLabel={resendLabel}
      canResend={canResend}
      onResendVerification={handleResendVerification}
    />
  )
}
