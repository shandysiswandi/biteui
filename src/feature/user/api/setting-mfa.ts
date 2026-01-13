import { apiGet } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { MfaSettings } from "../model/security"

type Response = {
  totp_enabled: boolean
  backup_code_enabled: boolean
  sms_enabled: boolean
}

export async function getSettingMfa(): Promise<MfaSettings> {
  const { data } = await apiGet<Response>(API_PATHS.identity.profileSettingsMfa, { auth: true })

  return {
    totpEnabled: data.totp_enabled,
    backupCodeEnabled: data.backup_code_enabled,
    smsEnabled: data.sms_enabled,
  }
}
