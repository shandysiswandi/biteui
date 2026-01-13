import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { compactObject } from "@/lib/utils/object"

import { userExport } from "../api/user-export"
import type { UsersInput } from "../model/user"
import { keys } from "./keys"

type Options = {
  enabled?: boolean
}

export function useUserExportQuery(input?: UsersInput, options?: Options) {
  const enabled = options?.enabled ?? false
  const normalizedParams = compactObject(input ?? {})

  return useQuery({
    queryKey: [...keys.usersExport, normalizedParams] as const,
    queryFn: () => userExport(normalizedParams),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 60_000, // 1m
  })
}
