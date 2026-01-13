import { useMutation, useQueryClient } from "@tanstack/react-query"

import { userCreate } from "../api/user-create"
import type { CreateUserInput } from "../model/user"
import { keys } from "./keys"

export function useCreateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserInput) => userCreate(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: keys.users })
    },
  })
}
