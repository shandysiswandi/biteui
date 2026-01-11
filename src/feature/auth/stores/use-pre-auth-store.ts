import { create } from "zustand"

import { useAuthStore } from "@/lib/stores/auth-store"

type PreAuthState = {
  challengeToken: string | null
  preAuthEmail: string | null
  setPreAuthSession: (session: { challengeToken: string; preAuthEmail?: string }) => void
  clearPreAuthSession: () => void
}

export const usePreAuthStore = create<PreAuthState>((set) => ({
  challengeToken: null,
  preAuthEmail: null,
  setPreAuthSession: ({ challengeToken, preAuthEmail }) => {
    useAuthStore.getState().clearSession()
    set({ challengeToken, preAuthEmail: preAuthEmail ?? null })
  },
  clearPreAuthSession: () => set({ challengeToken: null, preAuthEmail: null }),
}))
