import type { BaseSyntheticEvent } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router"

import { routes } from "@/lib/constants/routes"
import { Button } from "@/ui/components/base/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/ui/components/base/field"
import { PasswordInput } from "@/ui/components/base/password-input"

import type { ResetPasswordFormValues } from "../../hooks/use-reset-password"

type ResetPasswordFormProps = {
  form: UseFormReturn<ResetPasswordFormValues>
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
}

export function ResetPasswordForm({
  form,
  isSubmitting,
  submitLabel,
  onSubmit,
}: ResetPasswordFormProps) {
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
          <h1 className="text-2xl font-bold">{t("auth.resetPassword.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("auth.resetPassword.subtitle")}
          </p>
        </div>

        <Field data-invalid={!!errors.newPassword}>
          <FieldLabel htmlFor="new-password">{t("auth.resetPassword.newPasswordLabel")}</FieldLabel>
          <PasswordInput
            id="new-password"
            autoComplete="new-password"
            placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
            aria-invalid={errors.newPassword ? true : undefined}
            aria-describedby={errors.newPassword ? "new-password-error" : "new-password-help"}
            disabled={isSubmitting}
            {...register("newPassword")}
          />
          {!errors.newPassword?.message && (
            <FieldDescription id="new-password-help">
              {t("auth.resetPassword.hint")}
            </FieldDescription>
          )}
          {errors.newPassword?.message && (
            <FieldError id="new-password-error">{errors.newPassword.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirm-password">
            {t("auth.resetPassword.confirmPasswordLabel")}
          </FieldLabel>
          <PasswordInput
            id="confirm-password"
            autoComplete="new-password"
            placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
            aria-invalid={errors.confirmPassword ? true : undefined}
            aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            disabled={isSubmitting}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message && (
            <FieldError id="confirm-password-error">{errors.confirmPassword.message}</FieldError>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </Field>

        <p className="text-muted-foreground text-center text-sm">
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
