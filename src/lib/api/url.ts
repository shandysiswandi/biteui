type QueryValue = string | number | boolean | null | undefined

export function buildUrl(params: {
  baseUrl?: string
  path: string
  query?: Record<string, QueryValue>
}) {
  const trimmedBase = params.baseUrl?.replace(/\/+$/, "") ?? ""
  const trimmedPath = params.path.startsWith("/")
    ? params.path
    : `/${params.path}`

  const url = new URL(`${trimmedBase}${trimmedPath}`, window.location.origin)

  if (params.query) {
    for (const [key, value] of Object.entries(params.query)) {
      if (value === undefined || value === null) {
        continue
      }
      url.searchParams.set(key, String(value))
    }
  }

  if (!trimmedBase) {
    return `${trimmedPath}${url.search}`
  }

  return url.toString()
}
