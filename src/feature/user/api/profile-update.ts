import { apiPut } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

export async function profileUpdate({ name }: { name: string }): Promise<void> {
  await apiPut<void>(API_PATHS.identity.profile, { full_name: name }, { auth: true })
}
