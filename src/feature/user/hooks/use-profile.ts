import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import type { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { keys } from "@/feature/auth/queries/keys"
import { useZodForm } from "@/lib/hooks/use-zod-form"
import type { AuthUser } from "@/lib/types/auth"
import { notifyApiError } from "@/lib/utils/notify"

import { useProfileUpdateMutation } from "../queries/use-profile-update-mutation"

type ProfileValues = {
  name: string
}

const profileSchema = z.object({
  name: z.string().trim().min(5, "Please enter a valid name"),
})

type UseProfileState = {
  form: UseFormReturn<ProfileValues>
  isEditing: boolean
  isUpdating: boolean
  onClick: () => void
  onSubmit: () => void
}

export function useProfile(user?: AuthUser): UseProfileState {
  const updateProfileMutation = useProfileUpdateMutation()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const form = useZodForm(profileSchema, {
    defaultValues: {
      name: user?.name ?? "",
    },
  })

  useEffect(() => {
    if (!isEditing) {
      form.reset({ name: user?.name ?? "" })
    }
  }, [form, isEditing, user?.name])

  const onClick = () => {
    form.reset({ name: user?.name ?? "" })
    setIsEditing((value) => !value)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    if (updateProfileMutation.isPending) {
      return
    }

    if (!user) {
      return
    }

    const nextName = values.name

    if (nextName === user.name) {
      form.reset({ name: nextName })
      setIsEditing(false)
      return
    }

    try {
      await updateProfileMutation.mutateAsync({ name: nextName })
      form.reset({ name: nextName })
      queryClient.setQueryData(keys.me, (current?: AuthUser) => {
        if (!current) return current
        return { ...current, name: nextName }
      })
      setIsEditing(false)
      toast.success("Profile updated")
    } catch (error) {
      notifyApiError(error)
    }
  })

  return {
    form,
    isEditing,
    isUpdating: updateProfileMutation.isPending,
    onClick,
    onSubmit,
  }
}
