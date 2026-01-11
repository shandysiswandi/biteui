import { useQuery } from "@tanstack/react-query"

import { profile } from "../api/profile"
import { keys } from "./keys"
import { time15minutes } from "./times"

export function useProfileQuery(params?: { enabled?: boolean }) {
  return useQuery({
    queryKey: keys.me,
    queryFn: profile,
    enabled: params?.enabled ?? true,
    staleTime: time15minutes,
  })
}
