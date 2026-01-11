import { useMutation } from "@tanstack/react-query"

import { register } from "../api/register"
import type { RegisterInput } from "../model/register"

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
  })
}
