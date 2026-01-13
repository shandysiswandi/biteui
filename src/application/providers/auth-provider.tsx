import { useEffect } from "react"

import { useAuthStore } from "@/lib/stores/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const bootstrap = useAuthStore((state) => state.bootstrap)

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  return children
}
