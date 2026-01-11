const ACRONYMS = new Set(["id", "url", "api", "ui", "ip"])

export const snakeToPascal = (s: string) =>
  s
    .split("_")
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join("")

export const snakeToTitle = (s: string) =>
  s
    .split("_")
    .map((w) => {
      const lower = w.toLowerCase()
      if (ACRONYMS.has(lower)) return lower.toUpperCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(" ")

export const camelToTitle = (s: string) =>
  s
    // Insert space boundaries:
    // - between lower/number and upper: fullName -> full Name
    // - between acronym and normal word: APIKey -> API Key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(" ")
    .map((w) => {
      const lower = w.toLowerCase()
      if (ACRONYMS.has(lower)) return lower.toUpperCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(" ")
