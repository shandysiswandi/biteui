export const API_PATHS = {
  auth: {
    login: "/api/v1/identity/login",
    loginMfa: "/api/v1/identity/login/mfa",
    register: "/api/v1/identity/register",
    registerResend: "/api/v1/identity/register/resend",
    logout: "/api/v1/identity/logout",
    refresh: "/api/v1/identity/refresh",
    password: {
      forgot: "/api/v1/identity/password/forgot",
      change: "/api/v1/identity/password/change",
    },
    mfa: {
      totp: {
        setup: "/api/v1/identity/mfa/totp/setup",
        confirm: "/api/v1/identity/mfa/totp/confirm",
      },
    },
  },
  profile: "/api/v1/identity/profile",
} as const
