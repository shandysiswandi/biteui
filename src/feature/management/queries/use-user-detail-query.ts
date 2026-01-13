import { useQuery } from "@tanstack/react-query"

import { userDetail } from "../api/user-detail"
import { keys } from "./keys"

type Options = {
  enabled?: boolean
}

export function useUserDetailQuery(id?: string, options?: Options) {
  const enabled = Boolean(id && (options?.enabled ?? true))

  return useQuery({
    queryKey: [...keys.userDetail, id] as const,
    queryFn: () => userDetail(id as string),
    enabled,
    staleTime: 60_000, // 1m
    refetchOnWindowFocus: false,
  })
}
