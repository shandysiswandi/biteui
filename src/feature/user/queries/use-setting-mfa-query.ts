import { useQuery } from "@tanstack/react-query"

import { getSettingMfa } from "../api/setting-mfa"

export const mfaSettingsKey = ["identity", "mfa-settings"] as const

export function useSettingMfaQuery() {
  return useQuery({
    queryKey: mfaSettingsKey,
    queryFn: getSettingMfa,
  })
}
