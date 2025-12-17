import { routes } from "@/lib/constants/routes"

type RedirectState = {
  from?: {
    pathname?: string
    search?: string
    hash?: string
  }
}

export function getRedirectTo(state: unknown) {
  if (!state || typeof state !== "object") {
    return null
  }

  const from = (state as RedirectState).from
  if (!from || typeof from !== "object") {
    return null
  }

  const pathname = typeof from.pathname === "string" ? from.pathname : ""
  const search = typeof from.search === "string" ? from.search : ""
  const hash = typeof from.hash === "string" ? from.hash : ""

  if (!pathname.startsWith("/")) {
    return null
  }

  if (pathname === routes.auth.login) {
    return null
  }

  return `${pathname}${search}${hash}`
}
