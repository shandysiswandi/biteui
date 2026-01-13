import { toast } from "sonner"

import { ApiError } from "@/lib/api/error"

export function notifyApiError(error: unknown, fallback = "Something went wrong") {
  if (error instanceof ApiError) {
    toast.error(error.message)
    return
  }

  toast.error(fallback)
}
