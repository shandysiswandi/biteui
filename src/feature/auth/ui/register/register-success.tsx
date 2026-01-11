import { Link, useLocation } from "react-router"

import { routes } from "@/lib/constants/routes"
import { Button } from "@/ui/components/base/button"
import { FieldSeparator } from "@/ui/components/base/field"

import type { RegisterResult } from "../../hooks/use-register"

type RegisterSuccessProps = {
  result: RegisterResult
  displayEmail: string
  hasReachedResendLimit: boolean
  resendLabel: string
  canResend: boolean
  onResendVerification: () => void
}

export function RegisterSuccess({
  result,
  displayEmail,
  hasReachedResendLimit,
  resendLabel,
  canResend,
  onResendVerification,
}: RegisterSuccessProps) {
  const location = useLocation()
  const allowsResend = result === "created" || result === "unverified"
  const copyByResult: Record<RegisterResult, { title: string; description: string }> = {
    created: {
      title: "Registration successful!",
      description:
        "We've sent a verification link to your email address. Please verify your email to activate your account.",
    },
    unverified: {
      title: "Account not verified",
      description: "Your account is not verified yet. You can resend the verification email below.",
    },
    deactivated: {
      title: "Account deactivated",
      description:
        "Your account was previously deactivated. Please contact our support if you need help.",
    },
    notAllowed: {
      title: "Account not allowed",
      description:
        "Your account is not allowed to register right now. Please contact our support if you need help.",
    },
  }
  const { title, description: defaultDescription } = copyByResult[result]
  const description = defaultDescription

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-sm text-balance">{description}</p>

        {displayEmail && <p className="text-sm font-medium">{displayEmail}</p>}
      </div>

      {allowsResend && (
        <div className="flex flex-col items-center gap-2 text-center">
          {hasReachedResendLimit ? (
            <p className="text-muted-foreground text-xs text-balance">
              You have reached the resend limit. Try again in 15 minutes.
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
                Didn&apos;t get the email? We&apos;ll send another verification link.
              </p>
            </>
          )}
        </div>
      )}

      <FieldSeparator>OR</FieldSeparator>

      <Button asChild>
        <Link to={routes.auth.login} state={location.state}>
          Back to login
        </Link>
      </Button>
    </div>
  )
}
