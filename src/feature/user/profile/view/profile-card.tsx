import { BadgeCheckIcon, PencilLineIcon } from "lucide-react"

import type { AuthUser } from "@/lib/types/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/base/avatar"
import { Badge } from "@/ui/components/base/badge"
import { Button } from "@/ui/components/base/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/base/card"
import { Field, FieldError, FieldLabel } from "@/ui/components/base/field"
import { Input } from "@/ui/components/base/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/components/base/tooltip"

import { useProfileCard } from "../hook/use-profile-card"

type ProfileCardProps = {
  user: AuthUser
}

export function ProfileCard({ user }: ProfileCardProps) {
  const {
    displayName,
    form,
    initials,
    isEditing,
    isUpdating,
    statusLabel,
    handleEdit,
    handleCancel,
    handleUpdate,
  } = useProfileCard(user)
  const {
    register,
    formState: { errors },
  } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your personal information.</CardDescription>
        {!isEditing && (
          <CardAction>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  onClick={handleEdit}
                  aria-label="Edit profile"
                >
                  <PencilLineIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit profile</p>
              </TooltipContent>
            </Tooltip>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="h-14 w-14 rounded-full">
            <AvatarImage src={user.avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-semibold">{displayName}</div>
            <div className="text-muted-foreground text-sm">{user.email}</div>
          </div>
          <Badge variant="secondary" className="capitalize bg-blue-500 text-white dark:bg-blue-600">
            <BadgeCheckIcon />
            {statusLabel}
          </Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.fullName} className="grid gap-2">
            <FieldLabel htmlFor="full-name">Name</FieldLabel>
            <Input
              id="full-name"
              readOnly={!isEditing || isUpdating}
              aria-invalid={errors.fullName ? true : undefined}
              aria-describedby={errors.fullName ? "full-name-error" : undefined}
              disabled={isUpdating}
              {...register("fullName")}
            />
            {errors.fullName?.message && (
              <FieldError id="full-name-error">{errors.fullName.message}</FieldError>
            )}
          </Field>
          <Field className="grid gap-2">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" value={user.email} readOnly disabled />
          </Field>
        </div>
        {isEditing && (
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdate} disabled={isUpdating}>
              Update
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
