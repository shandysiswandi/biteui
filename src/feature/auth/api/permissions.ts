import { apiGet } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { PermissionsResult } from "../model/permission"

export async function permissions(): Promise<PermissionsResult> {
  const { data } = await apiGet<PermissionsResult>(API_PATHS.iam.permissions, { auth: true })

  return data
}
