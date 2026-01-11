import { useEffect, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { useUpdateProfileMutation } from "@/feature/user/profile/service/update-profile"
import { useZodForm } from "@/lib/hooks/use-zod-form"
import { useAuthStore } from "@/lib/stores/auth-store"
import type { AuthUser } from "@/lib/types/auth"
import { notifyApiError } from "@/lib/utils/notify"
import { getInitials } from "@/lib/utils/user"

type ProfileCardValues = {
  fullName: string
}

const profileCardSchema = z.object({
  fullName: z.string().trim().min(5, "Please enter a valid name"),
})

type ProfileCardState = {
  displayName: string
  form: UseFormReturn<ProfileCardValues>
  initials: string
  isEditing: boolean
  isUpdating: boolean
  statusLabel: string
  handleEdit: () => void
  handleCancel: () => void
  handleUpdate: () => void
}

export function useProfileCard(user: AuthUser): ProfileCardState {
  const updateProfileMutation = useUpdateProfileMutation()
  const setUser = useAuthStore((state) => state.setUser)
  const [isEditing, setIsEditing] = useState(false)
  const form = useZodForm(profileCardSchema, {
    defaultValues: {
      fullName: user.name,
    },
  })
  const isUpdating = updateProfileMutation.isPending
  const displayName = user.name

  useEffect(() => {
    if (!isEditing) {
      form.reset({ fullName: user.name })
    }
  }, [form, isEditing, user.name])

  const handleEdit = () => {
    form.reset({ fullName: user.name })
    setIsEditing(true)
  }

  const handleCancel = () => {
    form.reset({ fullName: user.name })
    setIsEditing(false)
  }

  const handleUpdate = form.handleSubmit(async (values) => {
    if (isUpdating) {
      return
    }

    const nextFullName = values.fullName

    if (nextFullName === user.name) {
      form.reset({ fullName: nextFullName })
      setIsEditing(false)
      return
    }

    try {
      await updateProfileMutation.mutateAsync({ full_name: nextFullName })
      form.reset({ fullName: nextFullName })
      setUser({ ...user, name: nextFullName })
      setIsEditing(false)
      toast.success("Profile updated")
    } catch (error) {
      notifyApiError(error)
    }
  })

  const initials = getInitials(displayName)

  const statusLabel = user.status ? user.status.replace(/_/g, " ") : "unknown"

  return {
    displayName,
    form,
    initials,
    isEditing,
    isUpdating,
    statusLabel,
    handleEdit,
    handleCancel,
    handleUpdate,
  }
}
