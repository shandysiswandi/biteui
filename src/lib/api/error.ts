import type { ApiErrorResponse } from "@/lib/api/types"

export class ApiError<TData = ApiErrorResponse> extends Error {
  readonly name = "ApiError"
  readonly status: number
  readonly data: TData | undefined

  constructor(params: { message: string; status: number; data?: TData }) {
    super(params.message)
    this.status = params.status
    this.data = params.data
  }
}
