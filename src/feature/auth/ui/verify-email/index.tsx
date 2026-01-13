import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import { routes } from "@/lib/constants/routes"
import { Button } from "@/ui/components/base/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/ui/components/base/field"
import { Input } from "@/ui/components/base/input"

import { useVerifyEmail } from "../../hooks/use-verify-email"

export default function Page() {
  const { t } = useTranslation()
  const { form, isInvalid, isVerifying, submit } = useVerifyEmail()
  const {
    register,
    formState: { errors },
  } = form

  if (isInvalid) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">{t("auth.verifyEmail.invalid.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("auth.verifyEmail.invalid.description")}
          </p>
        </div>
        <Button asChild>
          <Link to={routes.auth.login}>{t("auth.common.backToLogin")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={submit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("auth.verifyEmail.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("auth.verifyEmail.subtitle")}
          </p>
        </div>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">{t("auth.common.emailLabel")}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={t("auth.verifyEmail.emailPlaceholder")}
            autoComplete="email"
            disabled={isVerifying}
            aria-invalid={errors.email ? true : undefined}
            {...register("email")}
          />
          {errors.email?.message && (
            <FieldError className="text-xs">{errors.email.message}</FieldError>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isVerifying}>
            {isVerifying ? t("auth.verifyEmail.submitting") : t("auth.verifyEmail.submit")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
