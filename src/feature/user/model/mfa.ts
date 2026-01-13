export type SetupTotpOutput = {
  challengeToken: string
  key: string
  uri: string
}

export type SetupTotpInput = {
  friendlyName: string
  currentPassword: string
}

export type ConfirmTotpInput = {
  challengeToken: string
  code: string
}

export type BackupCodeInput = {
  currentPassword: string
}

export type BackupCodeOutput = {
  recoveryCodes: string[]
}
