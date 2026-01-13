import { useMutation, useQueryClient } from "@tanstack/react-query"

import { userUpdate } from "../api/user-update"
import type { UpdateUserInput } from "../model/user"
import { keys } from "./keys"

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateUserInput) => userUpdate(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: keys.users })
    },
  })
}
