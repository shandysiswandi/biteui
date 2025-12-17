export const routes = {
  home: "/",
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
  },
  dashboard: "/app/dashboard",
  me: {
    profile: "/app/me/profile",
    notification: "/app/me/notification",
    setting: "/app/me/setting",
  },
}

export const protectedPrefixes = ["/app"]
