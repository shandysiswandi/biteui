import { useLogin } from "../../hooks/use-login"
import { useLoginMfa } from "../../hooks/use-login-mfa"
import { LoginForm } from "./login-form"
import { LoginMfaForm } from "./login-mfa-form"

export default function Page() {
  const { form, isSubmitting, submit, continueWithGoogle } = useLogin()
  const {
    isMfaRequired,
    preAuthEmail,
    otpCode,
    setOtpCode,
    isOtpReady,
    isVerifying,
    submitMfa,
    resetMfa,
  } = useLoginMfa()

  if (isMfaRequired) {
    return (
      <LoginMfaForm
        preAuthEmail={preAuthEmail}
        otpCode={otpCode}
        onOtpChange={setOtpCode}
        isOtpReady={isOtpReady}
        isVerifying={isVerifying}
        onSubmit={submitMfa}
        onReset={resetMfa}
      />
    )
  }

  return (
    <LoginForm
      form={form}
      isSubmitting={isSubmitting}
      onSubmit={submit}
      onContinueWithGoogle={continueWithGoogle}
    />
  )
}
