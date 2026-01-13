import { useMutation, useQueryClient } from "@tanstack/react-query"

import { userImport } from "../api/user-import"
import { keys } from "./keys"

type UserImportPayload = {
  email: string
  password?: string
  full_name?: string
  status?: number
}

export function useUserImportMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UserImportPayload[]) => userImport(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: keys.users })
    },
  })
}
