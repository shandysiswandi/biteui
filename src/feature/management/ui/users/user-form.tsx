import { Controller } from "react-hook-form"

import { Input } from "@/ui/components/base/input"
import { Label } from "@/ui/components/base/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/base/select"

import type { CreateUserInput, UpdateUserInput, User } from "../../model/user"
import { statusOptions } from "../../model/user"
import { useUserForm } from "./use-user-form"

type UserFormProps = {
  data?: User
  mode: "create" | "edit" | "view"
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void
  isSubmitting: boolean
  formId: string
}

export function UserForm({ data, mode, onSubmit, isSubmitting, formId }: UserFormProps) {
  const { submit, isReadOnly, register, control, errors } = useUserForm({ data, mode, onSubmit })
  const isEditMode = mode === "edit"
  const showPassword = mode === "create"
  const showAvatarUrl = mode !== "create"

  return (
    <form id={formId} onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="iam-user-name">Full name</Label>
        <Input id="iam-user-name" {...register("name")} disabled={isReadOnly || isSubmitting} />
        {errors.name?.message && <p className="text-destructive text-xs">{errors.name.message}</p>}
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="iam-user-email">Email</Label>
        <Input
          id="iam-user-email"
          type="email"
          {...register("email")}
          disabled={isReadOnly || isSubmitting || isEditMode}
        />
        {errors.email?.message && (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        )}
      </div>
      {showPassword && (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="iam-user-password">Password</Label>
          <Input
            id="iam-user-password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            disabled={isReadOnly || isSubmitting}
          />
          {errors.password?.message && (
            <p className="text-destructive text-xs">{errors.password.message}</p>
          )}
        </div>
      )}
      {showAvatarUrl && (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="iam-avatar-url">Avatar URL</Label>
          <Input
            id="iam-avatar-url"
            {...register("avatarUrl")}
            disabled={isReadOnly || isSubmitting}
          />
          {errors.avatarUrl?.message && (
            <p className="text-destructive text-xs">{errors.avatarUrl.message}</p>
          )}
        </div>
      )}
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="iam-status">Status</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isReadOnly || isSubmitting}
            >
              <SelectTrigger id="iam-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.status?.message && (
          <p className="text-destructive text-xs">{errors.status.message}</p>
        )}
      </div>
    </form>
  )
}
