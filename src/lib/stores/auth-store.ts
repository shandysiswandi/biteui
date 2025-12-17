import { create } from "zustand"

import {
  clearAccessToken as clearStoredAccessToken,
  clearRefreshToken as clearStoredRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken as setStoredAccessToken,
  setRefreshToken as setStoredRefreshToken,
} from "@/lib/api/auth-token"
import type { AuthUser } from "@/lib/types/auth"

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  hasBootstrapped: boolean
  bootstrap: () => void
  setAccessToken: (token: string | null) => void
  setRefreshToken: (token: string | null) => void
  setUser: (user: AuthUser | null) => void
  setSession: (session: {
    accessToken: string | null
    refreshToken?: string | null
    user?: AuthUser | null
  }) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  user: null,
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

  setSession: ({ accessToken, refreshToken, user }) => {
    get().setAccessToken(accessToken)
    if (refreshToken !== undefined) {
      get().setRefreshToken(refreshToken)
    }
    set({ user: user ?? null })
  },

  clearSession: () => {
    clearStoredAccessToken()
    clearStoredRefreshToken()
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
    })
  },
}))
