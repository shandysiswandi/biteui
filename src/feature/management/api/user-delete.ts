import { apiDelete } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

export async function userDelete(id: string): Promise<void> {
  await apiDelete<void>(`${API_PATHS.identity.users}/${id}`, { auth: true })
}
