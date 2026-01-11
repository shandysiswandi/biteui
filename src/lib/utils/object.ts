export const compactObject = <T extends Record<string, unknown>>(input?: T) => {
  if (!input) {
    return undefined
  }

  const output: Partial<T> = {}
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        output[key as keyof T] = value as T[keyof T]
      }
      continue
    }
    if (value !== undefined && value !== null && value !== "") {
      output[key as keyof T] = value as T[keyof T]
    }
  }

  return Object.keys(output).length > 0 ? (output as T) : undefined
}
