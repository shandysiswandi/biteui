import { useEffect } from "react"
import { z } from "zod"

import { useZodForm } from "@/lib/hooks/use-zod-form"

import type { CreateUserInput, UpdateUserInput, User } from "../../model/user"
import { useUserDetailQuery } from "../../queries/use-user-detail-query"

const avatarUrlSchema = z
  .union([
    z
      .string()
      .trim()
      .url("Avatar URL must be a valid URL.")
      .refine((value) => value.startsWith("http://") || value.startsWith("https://"), {
        message: "Avatar URL must start with http:// or https://.",
      }),
    z.literal(""),
  ])
  .optional()
  .or(z.literal(""))
  .transform((value) => (value === "" ? undefined : value))

const baseUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  status: z.string().trim().min(1, "Status is required."),
  avatarUrl: avatarUrlSchema,
})

const createUserSchema = baseUserSchema.extend({
  password: z.string().min(1, "Password is required."),
})

const updateUserSchema = baseUserSchema

type BaseUserFormValues = z.infer<typeof baseUserSchema>
type CreateUserFormValues = z.infer<typeof createUserSchema>

export type UserFormValues = BaseUserFormValues & {
  password?: string
}

type UseUserFormOptions = {
  data?: User
  mode: "create" | "edit" | "view"
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void
}

export function useUserForm({ data, mode, onSubmit }: UseUserFormOptions) {
  const isReadOnly = mode === "view"
  const schema = mode === "create" ? createUserSchema : updateUserSchema
  const defaultValues: Partial<UserFormValues> = {
    name: data?.name ?? "",
    email: data?.email ?? "",
    status: String(data?.status ?? 2),
    avatarUrl: data?.avatarUrl ?? "",
  }
  if (mode === "create") {
    defaultValues.password = ""
  }

  const form = useZodForm<UserFormValues>(schema as z.ZodType<UserFormValues, UserFormValues>, {
    defaultValues,
  })
  const detailQuery = useUserDetailQuery(data?.id, { enabled: mode !== "create" })

  useEffect(() => {
    if (!detailQuery.data) {
      return
    }

    form.reset({
      name: detailQuery.data.name ?? "",
      email: detailQuery.data.email ?? "",
      status: String(detailQuery.data.status ?? 2),
      avatarUrl: detailQuery.data.avatarUrl ?? "",
    })
  }, [detailQuery.data, form])

  const submit = form.handleSubmit((values) => {
    if (isReadOnly) {
      return
    }

    if (mode === "create") {
      const createValues = values as unknown as CreateUserFormValues
      const payload: CreateUserInput = {
        name: createValues.name,
        email: createValues.email,
        status: Number(createValues.status),
        password: createValues.password,
      }
      onSubmit(payload)
      return
    }

    const payload: UpdateUserInput = {
      id: data?.id ?? "",
      name: values.name,
      status: Number(values.status),
    }
    onSubmit(payload)
  })

  return {
    form,
    submit,
    isReadOnly,
    register: form.register,
    control: form.control,
    errors: form.formState.errors,
  }
}
