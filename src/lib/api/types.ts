export type ApiErrorResponse = {
  message: string
  error?: Record<string, string>
}

export type ApiEnvelope<TData, TMeta = Record<string, unknown>> = {
  message: string
  data: TData
  meta?: TMeta
}
