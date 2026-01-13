const accessTokenKey = "biteui.accessToken"
const refreshTokenKey = "biteui.refreshToken"

export function getAccessToken() {
  if (typeof window === "undefined") {
    return undefined
  }

  return localStorage.getItem(accessTokenKey) ?? undefined
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(accessTokenKey, token)
}

export function clearAccessToken() {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem(accessTokenKey)
}

export function getRefreshToken() {
  if (typeof window === "undefined") {
    return undefined
  }

  return localStorage.getItem(refreshTokenKey) ?? undefined
}

export function setRefreshToken(token: string) {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(refreshTokenKey, token)
}

export function clearRefreshToken() {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem(refreshTokenKey)
}
