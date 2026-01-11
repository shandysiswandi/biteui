export const API_PATHS = {
  identity: {
    login: "/api/v1/identity/login",
    loginMfa: "/api/v1/identity/login/mfa",
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
    },
    profile: "/api/v1/identity/profile",
    users: "/api/v1/identity/users",
  },
  iam: {
    permissions: "/api/v1/iam/me/permissions",
  },
} as const
