import {
  ArrowRight,
  Bell,
  Command,
  Mail,
  MessageSquare,
  ShieldCheck,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react"
import { Link } from "react-router"

import { routes } from "@/lib/constants/routes"
import { Badge } from "@/ui/components/base/badge"
import { Button } from "@/ui/components/base/button"
import { Input } from "@/ui/components/base/input"
import { Textarea } from "@/ui/components/base/textarea"

const features: Array<{
  title: string
  description: string
  icon: LucideIcon
  delay: string
}> = [
  {
    title: "Signal routing",
    description:
      "Triage feedback into owned lanes with guardrails that keep work moving.",
    icon: Bell,
    delay: "delay-0",
  },
  {
    title: "Live playbooks",
    description:
      "Store rituals, checklists, and release beats in one calm workspace.",
    icon: SlidersHorizontal,
    delay: "delay-150",
  },
  {
    title: "Compliance ready",
    description:
      "Keep approvals, artifacts, and audit trails attached to every decision.",
    icon: ShieldCheck,
    delay: "delay-300",
  },
  {
    title: "Customer pulse",
    description:
      "Collect quotes, notes, and sentiment so priorities feel obvious.",
    icon: MessageSquare,
    delay: "delay-500",
  },
]

const contactOptions: Array<{
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    title: "General",
    description: "hello@biteui.co",
    icon: Mail,
  },
  {
    title: "Partnerships",
    description: "partners@biteui.co",
    icon: Bell,
  },
  {
    title: "Support",
    description: "support@biteui.co",
    icon: MessageSquare,
  },
]

export default function Page() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-[-12%] h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--primary)_0%,transparent_70%)] opacity-20 blur-3xl" />
          <div className="absolute top-20 left-[-14%] h-80 w-80 rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-35 blur-3xl" />
          <div className="absolute bottom-[-18%] right-[10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--secondary)_0%,transparent_70%)] opacity-35 blur-3xl" />
        </div>

        <main className="relative z-10">
          <section id="hero" className="pb-14 pt-12">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col gap-6">
                <Badge
                  variant="outline"
                  className="gap-2 text-[0.65rem] uppercase tracking-[0.35em]"
                >
                  <span className="size-2 rounded-full bg-primary" />
                  Public beta
                </Badge>
                <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                  Design product rituals that feel calm, clear, and alive.
                </h1>
                <p className="max-w-xl text-base text-muted-foreground md:text-lg">
                  BiteUI helps modern teams plan, ship, and learn from every
                  release with a studio-first workflow and signal rich insights.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild>
                    <Link to={routes.auth.register}>Get Started</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to={routes.dashboard}>
                      View dashboard
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary" />
                    Weekly rituals that stick
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary" />
                    Built for cross functional teams
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="animate-in fade-in-0 slide-in-from-bottom-8 duration-700 rounded-3xl border border-border bg-card p-6 shadow-lg">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    <span>Studio pulse</span>
                    <span className="flex items-center gap-2 text-primary">
                      <span className="size-2 rounded-full bg-primary" />
                      Live
                    </span>
                  </div>
                  <div className="mt-6 space-y-4 text-sm">
                    <div className="rounded-2xl border border-border bg-muted p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Release cadence
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        14 day shipping rhythm
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        Next launch: Tue 10:30 AM
                      </p>
                    </div>
                    <div className="grid gap-3">
                      {[
                        "Design review mapped to outcomes",
                        "Risk checks aligned with QA",
                        "Customer signal inbox refreshed",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3"
                        >
                          <span className="text-muted-foreground">{item}</span>
                          <span className="text-xs uppercase tracking-[0.3em] text-primary">
                            Ready
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-200 absolute -bottom-8 -left-6 hidden w-44 rounded-2xl border border-border bg-card p-4 text-sm shadow-lg lg:block">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Team focus
                  </p>
                  <p className="mt-2 text-lg font-semibold">6 loops closed</p>
                  <p className="mt-1 text-muted-foreground">
                    3 rituals updated today
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="py-16">
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex max-w-2xl flex-col gap-3">
                <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                  Features
                </span>
                <h2 className="text-3xl font-semibold md:text-4xl">
                  A studio stack for modern product teams.
                </h2>
                <p className="text-base text-muted-foreground">
                  Align planning, delivery, and learning with tools that make
                  clarity feel effortless.
                </p>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={feature.title}
                      className={`group animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ${feature.delay} rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
                    >
                      <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-primary">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section id="contact" className="py-16">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                      Contact
                    </span>
                    <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                      Let us shape your next release ritual.
                    </h2>
                  </div>
                  <p className="text-base text-muted-foreground">
                    Tell us about your team and timeline. We will map a plan and
                    share a tailored demo.
                  </p>
                  <div className="space-y-4">
                    {contactOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <div
                          key={option.title}
                          className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"
                        >
                          <Icon className="size-4 text-primary" />
                          <div>
                            <p className="text-sm font-semibold">
                              {option.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <form className="rounded-3xl border border-border bg-card p-6 shadow-lg">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="first-name"
                        className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
                      >
                        First name
                      </label>
                      <Input
                        id="first-name"
                        placeholder="Avery"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="last-name"
                        className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
                      >
                        Last name
                      </label>
                      <Input
                        id="last-name"
                        placeholder="Stone"
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <label
                      htmlFor="email"
                      className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
                    >
                      Work email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@studio.com"
                      className="bg-background"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <label
                      htmlFor="message"
                      className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
                    >
                      What are you building?
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Share goals, timeline, and team size."
                      className="bg-background"
                    />
                  </div>
                  <Button type="submit" className="mt-6 w-full">
                    Send message
                    <ArrowRight className="size-4" />
                  </Button>
                </form>
              </div>
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t border-border bg-background">
          <div className="mx-auto flex max-w-6xl gap-6 px-6 py-10 flex-row items-center justify-between">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Command className="size-4" />
              </span>
              BiteUI
            </div>

            <p className="text-xs text-muted-foreground">
              Build calmer launches with BiteUI.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
