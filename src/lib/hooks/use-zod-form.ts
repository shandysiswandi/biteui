import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type FieldValues, type UseFormProps } from "react-hook-form"
import type { z } from "zod"

export function useZodForm<
  TFieldValues extends FieldValues,
  TOutput = TFieldValues,
  TContext = unknown,
>(
  schema: z.ZodType<TOutput, TFieldValues>,
  options?: UseFormProps<TFieldValues, TContext, TOutput>,
) {
  return useForm<TFieldValues, TContext, TOutput>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    ...options,
  })
}
