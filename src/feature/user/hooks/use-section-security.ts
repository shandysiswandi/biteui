import { useSettingMfaQuery } from "../queries/use-setting-mfa-query"
import { useBackupCodes } from "./use-backup-codes"
import { useTotpSetup } from "./use-totp-setup"

export function useSectionSecurity() {
  const settingMfa = useSettingMfaQuery()
  const totpSetup = useTotpSetup()
  const isAuthenticatorEnabled = settingMfa.data?.totpEnabled ?? false
  const isSmsEnabled = settingMfa.data?.smsEnabled ?? false
  const isBackupCodeEnabled = settingMfa.data?.backupCodeEnabled ?? false
  const authenticatorButtonLabel = isAuthenticatorEnabled ? "Edit" : "Add"
  const backupCodesButtonLabel = isBackupCodeEnabled ? "View" : "Add"
  const backupCodes = useBackupCodes({ isBackupCodeEnabled })

  return {
    isSettingLoading: settingMfa.isLoading,
    isAuthenticatorEnabled,
    isSmsEnabled,
    isBackupCodeEnabled,
    authenticatorButtonLabel,
    backupCodesButtonLabel,
    ...totpSetup,
    ...backupCodes,
  }
}
