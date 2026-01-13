import { usePermissionsQuery } from "@/feature/auth/queries/use-permissions-query"
import { useAuthStore } from "@/lib/stores/auth-store"

export type AuthPermissions = Record<string, string[]>

const checkPermission = (
  permissions: AuthPermissions | undefined | null,
  resource: string,
  action: string,
) => {
  if (!permissions) return false

  const globalActions = permissions["*"]
  if (globalActions?.includes("*") || globalActions?.includes(action)) return true

  const resourceActions = permissions[resource]
  if (!resourceActions) return false

  return resourceActions.includes("*") || resourceActions.includes(action)
}

export const usePermission = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const permissionsQuery = usePermissionsQuery({
    enabled: Boolean(accessToken || refreshToken),
  })
  const permissions = permissionsQuery.data

  return (resource: string, ...actions: string[]): boolean[] => {
    return actions.map((action) => checkPermission(permissions, resource, action))
  }
}
