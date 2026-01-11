import { Link } from "react-router"

import { routes } from "@/lib/constants/routes"
import { Badge } from "@/ui/components/base/badge"
import { Button } from "@/ui/components/base/button"

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
      <Badge variant="secondary" className="px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em]">
        Error 404
      </Badge>
      <h3 className="mb-1.5 text-3xl font-semibold">Page not found</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        The page you&apos;re looking for isn&apos;t found. Go back to the dashboard or try a
        different section.
      </p>
      <Button asChild className="rounded-lg text-base">
        <Link to={routes.dashboard}>Back to dashboard</Link>
      </Button>
    </div>
  )
}
