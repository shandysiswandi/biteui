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
  FieldSeparator,
} from "@/ui/components/base/field"
import { Input } from "@/ui/components/base/input"
import { PasswordInput } from "@/ui/components/base/password-input"
import { Google } from "@/ui/components/logo/google"

import type { LoginFormValues } from "../../hooks/use-login"

type LoginFormProps = {
  form: UseFormReturn<LoginFormValues>
  isSubmitting: boolean
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  onContinueWithGoogle: () => void
}

export function LoginForm({ form, isSubmitting, onSubmit, onContinueWithGoogle }: LoginFormProps) {
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
          <h1 className="text-2xl font-bold">{t("auth.login.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">{t("auth.login.subtitle")}</p>
        </div>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">{t("auth.common.emailLabel")}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={t("auth.login.emailPlaceholder")}
            autoComplete="email"
            disabled={isSubmitting}
            aria-invalid={errors.email ? true : undefined}
            {...register("email")}
          />
          {errors.email?.message && (
            <FieldError className="text-xs">{errors.email.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.password}>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{t("auth.common.passwordLabel")}</FieldLabel>
            <Link
              to={routes.auth.forgotPassword}
              state={location.state}
              className="text-muted-foreground ml-auto text-sm underline-offset-4 hover:text-primary hover:underline"
            >
              {t("auth.login.forgotPassword")}
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder={t("auth.common.passwordPlaceholder")}
            disabled={isSubmitting}
            aria-invalid={errors.password ? true : undefined}
            {...register("password")}
          />
          {errors.password?.message && (
            <FieldError className="text-xs">{errors.password.message}</FieldError>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
          </Button>
        </Field>

        <FieldSeparator>{t("auth.common.or")}</FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            disabled={isSubmitting}
            onClick={onContinueWithGoogle}
          >
            <Google />
            {t("auth.common.continueWithGoogle")}
          </Button>
          <FieldDescription className="text-center">
            {t("auth.login.noAccount")}{" "}
            <Link
              to={routes.auth.register}
              state={location.state}
              className="underline underline-offset-4"
            >
              {t("auth.login.createAccount")}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
