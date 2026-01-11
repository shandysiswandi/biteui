import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import { routes } from "@/lib/constants/routes"
import { Button } from "@/ui/components/base/button"

import { useResetPassword } from "../../hooks/use-reset-password"
import { ResetPasswordForm } from "./reset-password-form"
import { ResetPasswordSuccess } from "./reset-password-success"

export default function Page() {
  const { t } = useTranslation()
  const { form, hasReset, isInvalid, isSubmitting, submit } = useResetPassword()
  const submitLabel = isSubmitting
    ? t("auth.resetPassword.submitting")
    : t("auth.resetPassword.submit")

  if (isInvalid) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">{t("auth.resetPassword.invalid.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("auth.resetPassword.invalid.description")}
          </p>
        </div>
        <Button asChild>
          <Link to={routes.auth.forgotPassword}>{t("auth.resetPassword.requestNew")}</Link>
        </Button>
      </div>
    )
  }

  if (hasReset) {
    return <ResetPasswordSuccess />
  }

  return (
    <ResetPasswordForm
      form={form}
      isSubmitting={isSubmitting}
      submitLabel={submitLabel}
      onSubmit={submit}
    />
  )
}
