import { useMutation } from "@tanstack/react-query"

import { apiPut } from "@/lib/api"

type UpdateProfileRequest = {
  full_name: string
}

async function updateProfile(payload: UpdateProfileRequest): Promise<void> {
  await apiPut<void>("/profile", payload, { auth: true })
}

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => updateProfile(payload),
  })
}
