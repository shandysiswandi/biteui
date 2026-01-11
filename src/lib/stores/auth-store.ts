import { create } from "zustand"

import {
  clearAccessToken as clearStoredAccessToken,
  clearRefreshToken as clearStoredRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken as setStoredAccessToken,
  setRefreshToken as setStoredRefreshToken,
} from "@/lib/api/auth-token"
import type { AuthPermissions } from "@/lib/auth/permissions"
import type { AuthUser } from "@/lib/types/auth"

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  permissions: AuthPermissions | null
  hasBootstrapped: boolean
  bootstrap: () => void
  setAccessToken: (token: string | null) => void
  setRefreshToken: (token: string | null) => void
  setUser: (user: AuthUser | null) => void
  setPermissions: (permissions: AuthPermissions | null) => void
  setSession: (session: {
    accessToken: string | null
    refreshToken?: string | null
    user?: AuthUser | null
    permissions?: AuthPermissions | null
  }) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  user: null,
  permissions: null,
  hasBootstrapped: false,

  bootstrap: () => {
    if (get().hasBootstrapped) {
      return
    }

    set({
      accessToken: getAccessToken(),
      refreshToken: getRefreshToken(),
      hasBootstrapped: true,
    })
  },

  setAccessToken: (token) => {
    if (token) {
      setStoredAccessToken(token)
    } else {
      clearStoredAccessToken()
    }

    set({ accessToken: token })
  },

  setRefreshToken: (token) => {
    if (token) {
      setStoredRefreshToken(token)
    } else {
      clearStoredRefreshToken()
    }

    set({ refreshToken: token })
  },

  setUser: (user) => set({ user }),
  setPermissions: (permissions) => set({ permissions }),

  setSession: ({ accessToken, refreshToken, user, permissions }) => {
    get().setAccessToken(accessToken)
    if (refreshToken !== undefined) {
      get().setRefreshToken(refreshToken)
    }
    set({
      user: user ?? null,
      permissions: permissions ?? null,
    })
  },

  clearSession: () => {
    clearStoredAccessToken()
    clearStoredRefreshToken()
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      permissions: null,
    })
  },
}))
