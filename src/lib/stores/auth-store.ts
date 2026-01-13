import { create } from "zustand"

import {
  clearAccessToken as clearStoredAccessToken,
  clearRefreshToken as clearStoredRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken as setStoredAccessToken,
  setRefreshToken as setStoredRefreshToken,
} from "@/lib/api/storage-token"

type AuthState = {
  accessToken?: string
  refreshToken?: string
  hasBootstrapped: boolean
  bootstrap: () => void
  setAccessToken: (token?: string) => void
  setRefreshToken: (token?: string) => void
  setSession: (session: { accessToken?: string; refreshToken?: string }) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
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

  setSession: ({ accessToken, refreshToken }) => {
    get().setAccessToken(accessToken)
    if (refreshToken !== undefined) {
      get().setRefreshToken(refreshToken)
    }
  },

  clearSession: () => {
    clearStoredAccessToken()
    clearStoredRefreshToken()
    set({
      accessToken: undefined,
      refreshToken: undefined,
    })
  },
}))
