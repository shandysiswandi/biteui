import type { Meta } from "@/lib/types/meta"

export type ApiErrorResponse = {
  message: string
  error?: Record<string, string>
}

export type ApiEnvelope<TData> = {
  message: string
  data: TData
  meta?: Meta
}
