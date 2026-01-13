import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { BackupCodeInput, BackupCodeOutput } from "../model/mfa"

type BackupCodeResponse = {
  recovery_codes: string[]
}

export async function createBackupCodes(input: BackupCodeInput): Promise<BackupCodeOutput> {
  const { data } = await apiPost<BackupCodeResponse>(
    API_PATHS.identity.mfa.backupCode,
    {
      current_password: input.currentPassword,
    },
    {
      auth: true,
    },
  )

  return { recoveryCodes: data.recovery_codes }
}
