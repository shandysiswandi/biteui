import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  const location = useLocation()
  const allowsResend = result === "created" || result === "unverified"
  const copyByResult: Record<RegisterResult, { title: string; description: string }> = {
    created: {
      title: t("auth.registerSuccess.created.title"),
      description: t("auth.registerSuccess.created.description"),
    },
    unverified: {
      title: t("auth.registerSuccess.unverified.title"),
      description: t("auth.registerSuccess.unverified.description"),
    },
    deactivated: {
      title: t("auth.registerSuccess.deactivated.title"),
      description: t("auth.registerSuccess.deactivated.description"),
    },
    notAllowed: {
      title: t("auth.registerSuccess.notAllowed.title"),
      description: t("auth.registerSuccess.notAllowed.description"),
    },
  }
  const { title, description } = copyByResult[result]

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
              {t("auth.registerSuccess.resend.limit")}
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
                {t("auth.registerSuccess.resend.hint")}
              </p>
            </>
          )}
        </div>
      )}

      <FieldSeparator>{t("auth.common.or")}</FieldSeparator>

      <Button asChild>
        <Link to={routes.auth.login} state={location.state}>
          {t("auth.common.backToLogin")}
        </Link>
      </Button>
    </div>
  )
}
