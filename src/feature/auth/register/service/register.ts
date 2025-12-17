import { useMutation } from "@tanstack/react-query"

import { apiPost, type ApiEnvelope } from "@/lib/api"

export type RegisterStatus = "Unverified" | "Banned"

type RegisterRequest = {
  email: string
  password: string
  full_name: string
}

type RegisterResponse = {
  email: string
  status: RegisterStatus
}

async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const envelope = await apiPost<ApiEnvelope<RegisterResponse>>(
    "/auth/register",
    payload,
  )

  return envelope.data
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
  })
}
