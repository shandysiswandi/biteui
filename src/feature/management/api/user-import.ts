import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

type UserImportPayload = {
  email: string
  password?: string
  full_name?: string
  status?: number
}

type UserImportResponse = {
  created: number
  updated: number
}

export async function userImport(payload: UserImportPayload[]): Promise<UserImportResponse> {
  const { data } = await apiPost<UserImportResponse>(API_PATHS.identity.usersImport, payload, {
    auth: true,
  })

  return data
}
