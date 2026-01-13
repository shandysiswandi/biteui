import { z } from "zod"

import { routes } from "@/lib/constants/routes"

const redirectStateSchema = z.object({
  from: z
    .object({
      pathname: z.string().optional(),
      search: z.string().optional(),
      hash: z.string().optional(),
    })
    .optional(),
})

type RedirectState = z.infer<typeof redirectStateSchema>

type RedirectInput = {
  state?: RedirectState
  search?: string
}

export function getRedirectTo({ state, search }: RedirectInput) {
  const parsed = redirectStateSchema.safeParse(state)
  if (!parsed.success) {
    return getRedirectFromSearch(search)
  }

  const { from } = parsed.data
  if (!from) {
    return getRedirectFromSearch(search)
  }

  const pathname = typeof from.pathname === "string" ? from.pathname : ""
  const fromSearch = typeof from.search === "string" ? from.search : ""
  const hash = typeof from.hash === "string" ? from.hash : ""

  if (!pathname.startsWith("/")) {
    return null
  }

  if (pathname === routes.auth.login) {
    return getRedirectFromSearch(search)
  }

  return `${pathname}${fromSearch}${hash}`
}

function getRedirectFromSearch(search?: string) {
  if (!search) {
    return null
  }

  const params = new URLSearchParams(search)
  const from = params.get("from")
  if (!from || !from.startsWith("/")) {
    return null
  }

  if (from === routes.auth.login) {
    return null
  }

  return from
}
