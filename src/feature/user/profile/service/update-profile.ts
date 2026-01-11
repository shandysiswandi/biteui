import { useMutation } from "@tanstack/react-query"

import { apiPut } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

type UpdateProfileRequest = {
  full_name: string
}

async function updateProfile(payload: UpdateProfileRequest): Promise<void> {
  await apiPut(API_PATHS.identity.profile, payload, { auth: true })
}

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => updateProfile(payload),
  })
}
