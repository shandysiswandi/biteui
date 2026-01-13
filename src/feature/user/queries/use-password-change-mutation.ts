import { useMutation } from "@tanstack/react-query"

import { passwordChange } from "../api/password-change"
import type { PasswordChangeInput } from "../model/password"

export function usePasswordChangeMutation() {
  return useMutation({
    mutationFn: (input: PasswordChangeInput) => passwordChange(input),
  })
}
