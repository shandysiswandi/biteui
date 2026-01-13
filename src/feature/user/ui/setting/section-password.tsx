import { Button } from "@/ui/components/base/button"
import { Card, CardContent, CardFooter } from "@/ui/components/base/card"
import { Field, FieldError, FieldLabel } from "@/ui/components/base/field"
import { PasswordInput } from "@/ui/components/base/password-input"

import { useSectionPassword } from "../../hooks/use-section-password"

export function SectionPassword() {
  const { form, isPending, onSubmit } = useSectionPassword()

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardContent className="flex flex-col gap-6 mb-6">
          <div className="grid gap-2">
            <Field data-invalid={!!form.formState.errors.currentPassword}>
              <FieldLabel htmlFor="current-password">Current password</FieldLabel>
              <PasswordInput
                id="current-password"
                autoComplete="current-password"
                placeholder="Enter your current password"
                aria-invalid={form.formState.errors.currentPassword ? true : undefined}
                aria-describedby={
                  form.formState.errors.currentPassword ? "current-password-error" : undefined
                }
                disabled={isPending}
                {...form.register("currentPassword")}
              />
              {form.formState.errors.currentPassword?.message && (
                <FieldError className="text-xs">
                  {form.formState.errors.currentPassword.message}
                </FieldError>
              )}
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Field data-invalid={!!form.formState.errors.currentPassword}>
                <FieldLabel htmlFor="new-password">New password</FieldLabel>
                <PasswordInput
                  id="new-password"
                  autoComplete="new-password"
                  placeholder="Create a new password"
                  aria-invalid={form.formState.errors.newPassword ? true : undefined}
                  aria-describedby={
                    form.formState.errors.newPassword ? "new-password-error" : "new-password-help"
                  }
                  disabled={isPending}
                  {...form.register("newPassword")}
                />
                {form.formState.errors.newPassword?.message && (
                  <FieldError className="text-xs">
                    {form.formState.errors.newPassword.message}
                  </FieldError>
                )}
              </Field>
            </div>

            <div className="grid gap-2">
              <Field data-invalid={!!form.formState.errors.currentPassword}>
                <FieldLabel htmlFor="new-password">Confirm password</FieldLabel>
                <PasswordInput
                  id="confirm-password"
                  autoComplete="new-password"
                  placeholder="Confirm a new password"
                  aria-invalid={form.formState.errors.confirmPassword ? true : undefined}
                  aria-describedby={
                    form.formState.errors.confirmPassword ? "confirm-password-error" : undefined
                  }
                  disabled={isPending}
                  {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword?.message && (
                  <FieldError className="text-xs">
                    {form.formState.errors.confirmPassword.message}
                  </FieldError>
                )}
              </Field>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between border-t">
          <p className="text-xs text-muted-foreground">Password must be 8-72 characters.</p>

          <Button type="submit" variant="secondary" disabled={isPending}>
            Update password
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
