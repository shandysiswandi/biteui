import { useAuthStore } from "@/lib/stores/auth-store"

export type AuthPermissions = Record<string, string[]>

export const can = (permissions: AuthPermissions | null, permission: string, action = "read") => {
  if (!permissions) {
    return false
  }

  const wildcardActions = permissions["*"]
  if (wildcardActions?.includes("*") || wildcardActions?.includes(action)) {
    return true
  }

  const actions = permissions[permission]
  return Boolean(actions?.includes("*") || actions?.includes(action))
}

type Action = string

type CanFn = {
  (permission: string, action: Action): boolean
  (permission: string, actions: Action[]): boolean[]
}

export const usePermission = (): CanFn => {
  const permissions = useAuthStore((state) => state.permissions)

  const canFn = ((permission: string, actionOrActions: Action | Action[]) => {
    if (Array.isArray(actionOrActions)) {
      return actionOrActions.map((action) => can(permissions, permission, action))
    }
    return can(permissions, permission, actionOrActions)
  }) as CanFn

  return canFn
}
