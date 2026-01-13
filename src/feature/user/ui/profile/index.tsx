import { CircleX, PencilLine } from "lucide-react"

import { useAuthProfile } from "@/lib/hooks/use-auth-profile"
import { getInitials } from "@/lib/utils/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/base/avatar"
import { Button } from "@/ui/components/base/button"
import { Card, CardContent } from "@/ui/components/base/card"
import { Field, FieldError, FieldLabel } from "@/ui/components/base/field"
import { Input } from "@/ui/components/base/input"
import { Skeleton } from "@/ui/components/base/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/components/base/tooltip"

import { useProfile } from "../../hooks/use-profile"

export default function Page() {
  const user = useAuthProfile()
  const { form, isEditing, isUpdating, onClick, onSubmit } = useProfile(user)

  if (!user) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-40 sm:h-48 bg-muted/50" />
          <div className="flex flex-col items-center gap-3 px-6 pb-6">
            <Skeleton className="-mt-10 h-20 w-20 rounded-full" />
            <Skeleton className="h-4 w-36 rounded-full" />
            <Skeleton className="h-3 w-44 rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const initials = getInitials(user.name)

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="relative p-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="absolute bg-card text-card-foreground right-5 top-5 z-10"
              onClick={onClick}
              aria-label={isEditing ? "Cancel" : "Edit"}
            >
              {isEditing ? <CircleX /> : <PencilLine />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>{isEditing ? "Cancel" : "Edit"}</span>
          </TooltipContent>
        </Tooltip>

        <figure className="relative h-40 sm:h-48 overflow-hidden bg-muted/50 rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 h-full w-full text-foreground/50"
            aria-hidden="true"
          >
            <defs>
              <pattern id="profile-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="10" r="2" fill="currentColor" />
                <circle cx="30" cy="30" r="3" fill="currentColor" />
              </pattern>
            </defs>
            <rect className="w-screen h-40 sm:h-48" fill="url(#profile-pattern)" />
          </svg>
        </figure>

        <div className="flex flex-col items-center gap-1 text-center">
          <Avatar className="-mt-10 h-20 w-20 rounded-full ring-4 ring-muted">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="rounded-full">{initials}</AvatarFallback>
          </Avatar>

          {isEditing ? (
            <form onSubmit={onSubmit} className="grid w-full max-w-xs gap-3">
              <Field data-invalid={!!form.formState.errors.name} className="grid gap-2 text-left">
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  aria-invalid={form.formState.errors.name ? true : undefined}
                  aria-describedby={form.formState.errors.name ? "name-error" : undefined}
                  disabled={isUpdating}
                  autoComplete="name"
                  {...form.register("name")}
                />
                {form.formState.errors.name?.message && (
                  <FieldError className="text-xs" id="name-error">
                    {form.formState.errors.name.message}
                  </FieldError>
                )}
              </Field>
              <Button type="submit" variant="secondary" disabled={isUpdating}>
                Save changes
              </Button>
            </form>
          ) : (
            <p className="text-lg font-semibold">{user.name}</p>
          )}

          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  )
}
