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

import type { RegisterFormValues } from "../../hooks/use-register"

type RegisterFormProps = {
  form: UseFormReturn<RegisterFormValues>
  isSubmitting: boolean
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  onContinueWithGoogle: () => void
}

export function RegisterForm({
  form,
  isSubmitting,
  onSubmit,
  onContinueWithGoogle,
}: RegisterFormProps) {
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
          <h1 className="text-2xl font-bold">{t("auth.register.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("auth.register.subtitle")}
          </p>
        </div>

        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">{t("auth.common.nameLabel")}</FieldLabel>
          <Input
            id="name"
            placeholder={t("auth.register.namePlaceholder")}
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            disabled={isSubmitting}
            {...register("name")}
          />
          {errors.name?.message && (
            <FieldError className="text-xs">{errors.name.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">{t("auth.common.emailLabel")}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={t("auth.register.emailPlaceholder")}
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email?.message && (
            <FieldError className="text-xs">{errors.email.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">{t("auth.common.passwordLabel")}</FieldLabel>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder={t("auth.common.passwordPlaceholder")}
            aria-invalid={errors.password ? true : undefined}
            disabled={isSubmitting}
            {...register("password")}
          />
          {errors.password?.message && (
            <FieldError className="text-xs">{errors.password.message}</FieldError>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("auth.register.submitting") : t("auth.register.submit")}
          </Button>

          <FieldDescription className="text-center">
            <span>{t("auth.register.termsPrefix")} </span>
            <Link to="/terms" className="underline underline-offset-4">
              {t("auth.register.termsLink")}
            </Link>
            <span> {t("auth.register.termsJoiner")} </span>
            <Link to="/privacy" className="underline underline-offset-4">
              {t("auth.register.privacyLink")}
            </Link>
            <span>{t("auth.register.termsSuffix")}</span>
          </FieldDescription>
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
            {t("auth.register.alreadyAccount")}{" "}
            <Link
              to={routes.auth.login}
              state={location.state}
              className="underline underline-offset-4"
            >
              {t("auth.register.login")}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
