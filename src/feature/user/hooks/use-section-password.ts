import { toast } from "sonner"
import { z } from "zod"

import { useZodForm } from "@/lib/hooks/use-zod-form"
import { notifyApiError } from "@/lib/utils/notify"

import { usePasswordChangeMutation } from "../queries/use-password-change-mutation"

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be 8-72 characters")
      .max(72, "New password must be 8-72 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export function useSectionPassword() {
  const mutation = usePasswordChangeMutation()
  const form = useZodForm(passwordChangeSchema, {
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })
  const onSubmit = form.handleSubmit(async (values) => {
    if (mutation.isPending) {
      return
    }

    try {
      await mutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      form.reset()
      toast.success("Password updated")
    } catch (error) {
      notifyApiError(error)
    }
  })

  return {
    form,
    isPending: mutation.isPending,
    onSubmit,
  }
}
