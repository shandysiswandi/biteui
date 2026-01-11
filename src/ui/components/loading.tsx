import { Loader2 } from "lucide-react"

export function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="text-muted-foreground size-20 animate-spin" />
    </div>
  )
}
