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

export function getRedirectTo(state: RedirectState) {
  const parsed = redirectStateSchema.safeParse(state)
  if (!parsed.success) {
    return null
  }

  const { from } = parsed.data
  if (!from) {
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
