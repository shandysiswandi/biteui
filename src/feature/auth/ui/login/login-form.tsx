import type { BaseSyntheticEvent } from "react"
import type { UseFormReturn } from "react-hook-form"
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
  const location = useLocation()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <form className={"flex flex-col gap-6"} noValidate onSubmit={onSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            aria-invalid={errors.email ? true : undefined}
            {...register("email")}
          />
          {errors.email?.message && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.password}>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              to={routes.auth.forgotPassword}
              state={location.state}
              className="text-muted-foreground ml-auto text-sm underline-offset-4 hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
            disabled={isSubmitting}
            aria-invalid={errors.password ? true : undefined}
            {...register("password")}
          />
          {errors.password?.message && <FieldError>{errors.password.message}</FieldError>}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <FieldSeparator>OR</FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            disabled={isSubmitting}
            onClick={onContinueWithGoogle}
          >
            <Google />
            Continue with Google
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              to={routes.auth.register}
              state={location.state}
              className="underline underline-offset-4"
            >
              Create new account
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
