import { useQuery } from "@tanstack/react-query"

import { permissions } from "../api/permissions"
import { keys } from "./keys"
import { time15minutes } from "./times"

export function usePermissionsQuery(params?: { enabled?: boolean }) {
  return useQuery({
    queryKey: keys.permissions,
    queryFn: permissions,
    enabled: params?.enabled ?? true,
    staleTime: time15minutes,
  })
}
