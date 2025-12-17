import { Link, useLocation } from "react-router"

import { type RegisterStatus } from "@/feature/auth/register/service/register"
import { routes } from "@/lib/constants/routes"
import { Button } from "@/ui/components/base/button"
import { FieldSeparator } from "@/ui/components/base/field"

type RegisterSuccessProps = {
  status: RegisterStatus
  displayEmail: string
  hasReachedResendLimit: boolean
  resendCooldownMinutes: number
  resendLabel: string
  canResend: boolean
  onResendVerification: () => void
}

export function RegisterSuccess({
  status,
  displayEmail,
  hasReachedResendLimit,
  resendCooldownMinutes,
  resendLabel,
  canResend,
  onResendVerification,
}: RegisterSuccessProps) {
  const location = useLocation()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {status === "Banned"
            ? "We couldn't complete your registration"
            : "Registration successful!"}
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          {status === "Banned"
            ? "This account is currently banned. If this feels like a mistake, please reach out for help."
            : "We've sent a verification link to your email address. Please verify your email to activate your account."}
        </p>

        {displayEmail && <p className="text-sm font-medium">{displayEmail}</p>}
      </div>
      {status === "Unverified" && (
        <div className="flex flex-col items-center gap-2 text-center">
          {hasReachedResendLimit ? (
            <p className="text-muted-foreground text-xs text-balance">
              You have reached the resend limit. Redirecting to login in{" "}
              {resendCooldownMinutes} minute
              {resendCooldownMinutes === 1 ? "" : "s"}.
            </p>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={onResendVerification}
                disabled={!canResend}
              >
                {resendLabel}
              </Button>
              <p className="text-muted-foreground text-xs text-balance">
                Didn&apos;t get the email? We&apos;ll send another verification
                link.
              </p>
            </>
          )}
        </div>
      )}

      <FieldSeparator>-</FieldSeparator>

      <Button asChild>
        <Link to={routes.auth.login} state={location.state}>
          Back to login
        </Link>
      </Button>
    </div>
  )
}
