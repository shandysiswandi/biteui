export const API_PATHS = {
  auth: {
    login: "/api/v1/auth/login",
    loginMfa: "/api/v1/auth/login/mfa",
    register: "/api/v1/auth/register",
    registerResend: "/api/v1/auth/register/resend",
    logout: "/api/v1/auth/logout",
    refresh: "/api/v1/auth/refresh",
    password: {
      forgot: "/api/v1/auth/password/forgot",
      change: "/api/v1/auth/password/change",
    },
    mfa: {
      totp: {
        setup: "/api/v1/auth/mfa/totp/setup",
        confirm: "/api/v1/auth/mfa/totp/confirm",
      },
    },
  },
  profile: "/api/v1/auth/profile",
} as const
