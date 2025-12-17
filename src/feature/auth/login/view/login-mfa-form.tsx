import { Button } from "@/ui/components/base/button"
import { Field, FieldGroup, FieldLabel } from "@/ui/components/base/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/ui/components/base/input-otp"

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
          <h1 className="text-2xl font-bold">Verify your sign-in</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter the six-digit code from your authenticator.
          </p>
          {preAuthEmail && (
            <p className="text-sm font-medium">{preAuthEmail}</p>
          )}
        </div>

        <Field>
          <FieldLabel
            htmlFor="otp-code"
            className="w-full justify-center text-center"
          >
            OTP
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
            {isVerifying ? "Verifying..." : "Verify code"}
          </Button>
        </Field>

        <Field>
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            disabled={isVerifying}
          >
            Use another account
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
