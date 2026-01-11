import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
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
    ? t("auth.register.resend.sending")
    : resendCooldownSeconds > 0
      ? t("auth.register.resend.availableIn", {
          time: formatResendCooldown(resendCooldownSeconds),
        })
      : t("auth.register.resend.button")

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
