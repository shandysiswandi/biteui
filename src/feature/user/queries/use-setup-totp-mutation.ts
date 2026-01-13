import { useMutation } from "@tanstack/react-query"

import { setupTotp } from "../api/setup-totp"
import type { SetupTotpInput } from "../model/mfa"

export function useSetupTotpMutation() {
  return useMutation({
    mutationFn: (input: SetupTotpInput) => setupTotp(input),
  })
}
