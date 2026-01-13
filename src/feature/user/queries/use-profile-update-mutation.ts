import { useMutation } from "@tanstack/react-query"

import { profileUpdate } from "../api/profile-update"

export function useProfileUpdateMutation() {
  return useMutation({
    mutationFn: (input: { name: string }) => profileUpdate(input),
  })
}
