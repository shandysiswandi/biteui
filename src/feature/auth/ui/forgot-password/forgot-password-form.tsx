import type { BaseSyntheticEvent } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router"

import { routes } from "@/lib/constants/routes"
import { Button } from "@/ui/components/base/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/ui/components/base/field"
import { Input } from "@/ui/components/base/input"

import type { ForgotPasswordFormValues } from "../../hooks/use-forgot-password"

type ForgotPasswordFormProps = {
  form: UseFormReturn<ForgotPasswordFormValues>
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
}

export function ForgotPasswordForm({
  form,
  isSubmitting,
  submitLabel,
  onSubmit,
}: ForgotPasswordFormProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <form className={"flex flex-col gap-6"} noValidate onSubmit={onSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("auth.forgotPassword.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("auth.forgotPassword.subtitle")}
          </p>
        </div>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">{t("auth.common.emailLabel")}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={t("auth.forgotPassword.emailPlaceholder")}
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email?.message && (
            <FieldError className="text-xs">{errors.email.message}</FieldError>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </Field>

        <p className="text-muted-foreground text-center text-sm">
          {t("auth.forgotPassword.remembered")}{" "}
          <Link
            to={routes.auth.login}
            state={location.state}
            className="text-primary underline underline-offset-4"
          >
            {t("auth.common.backToLogin")}
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
