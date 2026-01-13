import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createBackupCodes } from "../api/backup-code"
import type { BackupCodeInput } from "../model/mfa"
import { mfaSettingsKey } from "./use-setting-mfa-query"

export function useBackupCodeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: BackupCodeInput) => createBackupCodes(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mfaSettingsKey }),
  })
}
