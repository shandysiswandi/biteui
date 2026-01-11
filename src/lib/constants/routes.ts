export const routes = {
  public: {
    home: "/",
    privacy: "/privacy",
    terms: "/terms",
  },
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
  },
  dashboard: "/app/dashboard",
  feature1: {
    page1: "/app/feature1/page1",
    page2: "/app/feature1/page2",
  },
  feature2: {
    page1: "/app/feature2/page1",
    page2: "/app/feature2/page2",
  },
  user: {
    profile: "/app/user/profile",
    notifications: "/app/user/notifications",
    settings: "/app/user/settings",
  },
  management: {
    users: "/app/management/users",
    iam: "/app/management/iam",
  },
}

export const protectedPrefixes = ["/app"]
