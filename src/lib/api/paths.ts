export const API_PATHS = {
  identity: {
    login: "/api/v1/identity/login",
    loginMfa: "/api/v1/identity/login/2fa",
    register: "/api/v1/identity/register",
    registerResend: "/api/v1/identity/register/resend",
    registerVerify: "/api/v1/identity/register/verify",
    logout: "/api/v1/identity/logout",
    refresh: "/api/v1/identity/refresh",
    password: {
      forgot: "/api/v1/identity/password/forgot",
      reset: "/api/v1/identity/password/reset",
      change: "/api/v1/identity/password/change",
    },
    mfa: {
      totp: {
        setup: "/api/v1/identity/mfa/totp/setup",
        confirm: "/api/v1/identity/mfa/totp/confirm",
      },
      backupCode: "/api/v1/identity/mfa/backup-code",
    },
    permissions: "/api/v1/identity/profile/permissions",
    profile: "/api/v1/identity/profile",
    profileSettingsMfa: "/api/v1/identity/profile/settings/mfa",
    users: "/api/v1/identity/users",
    usersImport: "/api/v1/identity/users-import",
    usersExport: "/api/v1/identity/users-export",
  },
} as const
