import { toast } from "sonner"
import { z } from "zod"

import { useChangePasswordMutation } from "@/feature/user/profile/service/change-password"
import { useZodForm } from "@/lib/hooks/use-zod-form"
import { notifyApiError } from "@/lib/utils/notify"

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be 8-72 characters")
      .max(72, "New password must be 8-72 characters")
      .regex(/^\S+$/, "Password cannot contain spaces")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/\d/, "Password must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export function useChangePassword() {
  const changePasswordMutation = useChangePasswordMutation()
  const form = useZodForm(changePasswordSchema, {
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })
  const isSubmitting = changePasswordMutation.isPending

  const clear = () => {
    form.reset()
  }
  const submitChangePassword = form.handleSubmit(async (values) => {
    if (isSubmitting) {
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        current_password: values.currentPassword,
        new_password: values.newPassword,
      })

      toast.success("Password updated")
      clear()
    } catch (error) {
      notifyApiError(error)
    }
  })

  return {
    form,
    isSubmitting,
    submitChangePassword,
    clear,
  }
}
