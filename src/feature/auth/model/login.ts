export type LoginOutput = {
  mfaRequired?: boolean
  challengeToken?: string
  accessToken?: string
  refreshToken?: string
}

export type LoginInput = {
  email: string
  password: string
}

export type LoginMfaInput = {
  challengeToken: string
  method: string // TOTP or BackupCode
  code: string
}
