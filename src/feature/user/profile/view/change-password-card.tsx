import { Button } from "@/ui/components/base/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/base/card"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/ui/components/base/field"
import { PasswordInput } from "@/ui/components/base/password-input"

import { useChangePassword } from "../hook/use-change-password"

export function ChangePasswordCard() {
  const { form, isSubmitting, submitChangePassword, clear } = useChangePassword()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Choose a strong password to keep your account secure.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submitChangePassword}>
          <div className="space-y-3">
            <Field
              data-invalid={!!errors.currentPassword}
              className="flex flex-col gap-2 sm:flex-row sm:items-start"
            >
              <FieldLabel htmlFor="current-password" className="sm:w-40 sm:pt-2">
                Current password:
              </FieldLabel>
              <div className="flex-1 space-y-1">
                <PasswordInput
                  id="current-password"
                  autoComplete="current-password"
                  placeholder="Enter your current password"
                  aria-invalid={errors.currentPassword ? true : undefined}
                  aria-describedby={errors.currentPassword ? "current-password-error" : undefined}
                  disabled={isSubmitting}
                  {...register("currentPassword")}
                />
                {errors.currentPassword?.message && (
                  <FieldError id="current-password-error">
                    {errors.currentPassword.message}
                  </FieldError>
                )}
              </div>
            </Field>
            <Field
              data-invalid={!!errors.newPassword}
              className="flex flex-col gap-2 sm:flex-row sm:items-start"
            >
              <FieldLabel htmlFor="new-password" className="sm:w-40 sm:pt-2">
                New password:
              </FieldLabel>
              <div className="flex-1 space-y-1">
                <PasswordInput
                  id="new-password"
                  autoComplete="new-password"
                  placeholder="Create a new password"
                  aria-invalid={errors.newPassword ? true : undefined}
                  aria-describedby={errors.newPassword ? "new-password-error" : "new-password-help"}
                  disabled={isSubmitting}
                  {...register("newPassword")}
                />
                {!errors.newPassword?.message && (
                  <FieldDescription id="new-password-help">
                    Use 8-72 characters with upper/lowercase letters and a number.
                  </FieldDescription>
                )}
                {errors.newPassword?.message && (
                  <FieldError id="new-password-error">{errors.newPassword.message}</FieldError>
                )}
              </div>
            </Field>
            <Field
              data-invalid={!!errors.confirmPassword}
              className="flex flex-col gap-2 sm:flex-row sm:items-start"
            >
              <FieldLabel htmlFor="confirm-password" className="sm:w-40 sm:pt-2">
                Confirm password:
              </FieldLabel>
              <div className="flex-1 space-y-1">
                <PasswordInput
                  id="confirm-password"
                  autoComplete="new-password"
                  placeholder="Confirm a new password"
                  aria-invalid={errors.confirmPassword ? true : undefined}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  disabled={isSubmitting}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword?.message && (
                  <FieldError id="confirm-password-error">
                    {errors.confirmPassword.message}
                  </FieldError>
                )}
              </div>
            </Field>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={clear}>
              Clear
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Update password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
