import { ArrowUpRight, Compass, LogIn, UserPlus, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router"

import { routes } from "@/lib/constants/routes"
import { Badge } from "@/ui/components/base/badge"
import { Button } from "@/ui/components/base/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/base/card"

const quickLinks: Array<{
  title: string
  description: string
  to: string
  icon: LucideIcon
}> = [
  {
    title: "Return to the hub",
    description: "Back to the landing page overview.",
    to: routes.public.home,
    icon: Compass,
  },
  {
    title: "Sign in",
    description: "Jump into your workspace.",
    to: routes.auth.login,
    icon: LogIn,
  },
  {
    title: "Create account",
    description: "Start building your ritual board.",
    to: routes.auth.register,
    icon: UserPlus,
  },
]

export default function Page() {
  const location = useLocation()
  const requestedPath = location.pathname || "/"

  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--primary)_0%,transparent_70%)] opacity-15 blur-3xl" />
        <div className="absolute top-24 left-[-14%] h-80 w-80 rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-30 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[6%] h-96 w-96 rounded-full bg-[radial-gradient(circle,var(--secondary)_0%,transparent_70%)] opacity-40 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(0,0,0,0.03)_50%,transparent_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col gap-12 px-6 py-16 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <Badge variant="outline" className="gap-2 text-[0.65rem] uppercase tracking-[0.35em]">
            <span className="size-2 rounded-full bg-primary" />
            Signal lost
          </Badge>

          <div className="space-y-4">
            <p className="text-6xl font-semibold leading-none text-transparent md:text-7xl bg-clip-text bg-[linear-gradient(120deg,var(--foreground)_0%,var(--muted-foreground)_100%)]">
              404
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              We couldn&apos;t map that route.
            </h1>
            <p className="max-w-md text-base text-muted-foreground md:text-lg">
              The page you&apos;re looking for doesn&apos;t exist or was moved to a new destination.
            </p>
            <div className="text-sm text-muted-foreground">
              Requested path:{" "}
              <span className="inline-flex max-w-full break-all rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-foreground">
                {requestedPath}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to={routes.public.home}>Back to home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={routes.auth.login}>Sign in</Link>
            </Button>
          </div>
        </div>

        <Card className="animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Quick paths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickLinks.map(({ title, description, to, icon: Icon }) => (
              <Link
                key={title}
                to={to}
                className="group flex items-start gap-3 rounded-xl border border-border/60 bg-background/70 p-4 transition hover:border-border hover:bg-accent/40"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Icon className="size-5" />
                </span>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <span className="mt-1 flex size-8 items-center justify-center rounded-full border border-transparent text-muted-foreground transition group-hover:border-border group-hover:text-foreground">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
