import { apiGet } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

export async function permissions(): Promise<Record<string, string[]>> {
  const { data } = await apiGet<{ permissions: Record<string, string[]> }>(
    API_PATHS.identity.permissions,
    { auth: true },
  )

  return data.permissions
}
