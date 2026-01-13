import { useTranslation } from "react-i18next"

import { Button } from "@/ui/components/base/button"
import { Field, FieldGroup, FieldLabel } from "@/ui/components/base/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/ui/components/base/input-otp"

type LoginMfaFormProps = {
  preAuthEmail: string | null
  otpCode: string
  onOtpChange: (value: string) => void
  isOtpReady: boolean
  isVerifying: boolean
  onSubmit: () => void
  onReset: () => void
}

export function LoginMfaForm({
  preAuthEmail,
  otpCode,
  onOtpChange,
  isOtpReady,
  isVerifying,
  onSubmit,
  onReset,
}: LoginMfaFormProps) {
  const { t } = useTranslation()

  return (
    <form
      className={"flex flex-col gap-6"}
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("auth.loginMfa.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("auth.loginMfa.subtitle")}
          </p>
          {preAuthEmail && <p className="text-sm font-medium">{preAuthEmail}</p>}
        </div>

        <Field>
          <FieldLabel htmlFor="otp-code" className="w-full justify-center text-center">
            {t("auth.loginMfa.otpLabel")}
          </FieldLabel>
          <div className="flex justify-center">
            <InputOTP
              id="otp-code"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              value={otpCode}
              onChange={onOtpChange}
              disabled={isVerifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </Field>

        <Field>
          <Button type="submit" disabled={!isOtpReady || isVerifying}>
            {isVerifying ? t("auth.loginMfa.verifying") : t("auth.loginMfa.verify")}
          </Button>
        </Field>

        <Field>
          <Button type="button" variant="ghost" onClick={onReset} disabled={isVerifying}>
            {t("auth.loginMfa.useAnotherAccount")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
