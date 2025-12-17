import { useMutation } from "@tanstack/react-query"

import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

export type RegisterStatus = "Unverified" | "Banned"

type RegisterRequest = {
  email: string
  password: string
  full_name: string
}

async function register(payload: RegisterRequest): Promise<void> {
  await apiPost<void>(API_PATHS.auth.register, payload)
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
  })
}
