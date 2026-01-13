import { useMutation, useQueryClient } from "@tanstack/react-query"

import { userDelete } from "../api/user-delete"
import { keys } from "./keys"

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => userDelete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: keys.users })
    },
  })
}
