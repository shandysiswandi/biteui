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

import type { RegisterFormValues } from "../hook/use-register"

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
  const location = useLocation()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <form className={"flex flex-col gap-6"} noValidate onSubmit={onSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your details below to create your account
          </p>
        </div>

        <Field data-invalid={!!errors.full_name}>
          <FieldLabel htmlFor="full_name">Name</FieldLabel>
          <Input
            id="full_name"
            placeholder="Jane Doe"
            autoComplete="name"
            aria-invalid={errors.full_name ? true : undefined}
            disabled={isSubmitting}
            {...register("full_name")}
          />
          {errors.full_name?.message && (
            <FieldError>{errors.full_name.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email?.message && (
            <FieldError>{errors.email.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
            aria-invalid={errors.password ? true : undefined}
            disabled={isSubmitting}
            {...register("password")}
          />
          {errors.password?.message && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create account"}
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
            Already have an account?{" "}
            <Link
              to={routes.auth.login}
              state={location.state}
              className="underline underline-offset-4"
            >
              Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
