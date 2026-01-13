import { useMutation, useQueryClient } from "@tanstack/react-query"

import { confirmTotp } from "../api/confirm-totp"
import type { ConfirmTotpInput } from "../model/mfa"
import { mfaSettingsKey } from "./use-setting-mfa-query"

export function useConfirmTotpMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ConfirmTotpInput) => confirmTotp(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mfaSettingsKey }),
  })
}
