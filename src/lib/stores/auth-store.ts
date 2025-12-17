import { create } from "zustand"

import {
  clearAccessToken as clearStoredAccessToken,
  clearRefreshToken as clearStoredRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken as setStoredAccessToken,
  setRefreshToken as setStoredRefreshToken,
} from "@/lib/api"
import type { AuthUser } from "@/lib/types/auth"

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  challenge_id: string | null
  preAuthEmail: string | null
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
  setPreAuthSession: (session: {
    challenge_id: string
    preAuthEmail?: string
  }) => void
  clearPreAuthSession: () => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  user: null,
  challenge_id: null,
  preAuthEmail: null,
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
    get().clearPreAuthSession()
  },

  setPreAuthSession: ({ challenge_id, preAuthEmail }) => {
    get().clearSession()
    set({ challenge_id, preAuthEmail: preAuthEmail ?? null })
  },

  clearPreAuthSession: () => set({ challenge_id: null, preAuthEmail: null }),

  clearSession: () => {
    clearStoredAccessToken()
    clearStoredRefreshToken()
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      challenge_id: null,
      preAuthEmail: null,
    })
  },
}))
