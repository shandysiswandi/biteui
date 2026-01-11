import { type ReactNode } from "react"
import { AlertTriangle, Cookie, Globe, Lock, Mail, RefreshCcw, Shield } from "lucide-react"

type SectionProps = {
  id: string
  icon: ReactNode
  title: string
  children: ReactNode
}

type InfoCardProps = {
  title: string
  items: string[]
}

type MiniCardProps = {
  title: string
  desc: string
}

type TocLinkProps = {
  href: string
  label: string
}

type MobileChipProps = {
  href: string
  label: string
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/75 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Privacy Policy</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Transparent by design • Mobile-first
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-4 pt-10 sm:px-6 sm:pt-14">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-b from-slate-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-slate-900/60 dark:to-slate-950">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-slate-200/60 blur-3xl dark:bg-slate-700/30" />
          <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-slate-200/60 blur-3xl dark:bg-slate-700/30" />

          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              <Lock className="h-3.5 w-3.5" />
              Theme-aware • Accessible • Responsive
            </p>

            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-4xl">
              Your privacy, explained like a human.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              This Privacy Policy describes what we collect, why we collect it, how we use it, and
              the choices you have. Keep in mind: legal text is often weird — we keep ours
              practical.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs text-slate-500 dark:text-slate-400">Effective date</p>
                <p className="font-semibold">January 1, 2026</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs text-slate-500 dark:text-slate-400">Last updated</p>
                <p className="font-semibold">January 9, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_280px]">
        {/* Policy sections */}
        <article className="space-y-6">
          <Section id="overview" icon={<Globe className="h-5 w-5" />} title="1) Overview">
            <p>
              We collect the minimum information needed to operate, improve, and secure our
              services. We do not sell your personal information.
            </p>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>We only use data for providing and improving the service.</li>
              <li>We use security measures to protect your information.</li>
              <li>You control many settings, including marketing preferences.</li>
            </ul>
          </Section>

          <Section
            id="data-we-collect"
            icon={<Shield className="h-5 w-5" />}
            title="2) Information we collect"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                title="Account Information"
                items={["Name", "Email address", "Password (hashed)", "Profile preferences"]}
              />
              <InfoCard
                title="Usage Information"
                items={[
                  "Pages viewed",
                  "Feature interactions",
                  "Device and browser type",
                  "IP address",
                ]}
              />
              <InfoCard
                title="Transaction Information"
                items={[
                  "Purchase history",
                  "Billing details (via payment processor)",
                  "Refund records",
                ]}
              />
              <InfoCard
                title="Support Information"
                items={[
                  "Messages you send to support",
                  "Diagnostic logs you provide",
                  "Screenshots you upload",
                ]}
              />
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Some data is collected automatically (like logs) to keep the service running and
              secure.
            </p>
          </Section>

          <Section
            id="how-we-use"
            icon={<RefreshCcw className="h-5 w-5" />}
            title="3) How we use your information"
          >
            <ul className="list-inside list-disc space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>Provide, maintain, and improve our services.</li>
              <li>Personalize features (e.g., language preferences).</li>
              <li>Monitor and prevent fraud, abuse, or security incidents.</li>
              <li>Process payments and fulfill purchases.</li>
              <li>Communicate with you about updates and policy changes.</li>
            </ul>
          </Section>

          <Section
            id="cookies"
            icon={<Cookie className="h-5 w-5" />}
            title="4) Cookies & similar technologies"
          >
            <p>
              We use cookies to remember settings, keep you signed in, and understand how the
              product is used. You can control cookies through your browser settings.
            </p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="font-semibold">Cookie types</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <MiniCard title="Essential" desc="Required for login and security." />
                <MiniCard title="Preferences" desc="Remembers your settings (like theme)." />
                <MiniCard title="Analytics" desc="Helps us understand usage trends." />
                <MiniCard title="Marketing" desc="Only used if you opt in." />
              </div>
            </div>
          </Section>

          <Section id="sharing" icon={<Lock className="h-5 w-5" />} title="5) Sharing & disclosure">
            <p>
              We may share information with trusted service providers (like hosting and payments)
              who process data on our behalf. We may also disclose information if required by law or
              to protect rights and safety.
            </p>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5" />
                <p>
                  We never sell personal data. If that ever changed, we would update this policy and
                  provide clear notice.
                </p>
              </div>
            </div>
          </Section>

          <Section id="security" icon={<Shield className="h-5 w-5" />} title="6) Security">
            <p>
              We use administrative, technical, and physical safeguards to protect your information.
              No system is 100% secure, but we take security seriously and work to prevent
              unauthorized access.
            </p>
          </Section>

          <Section
            id="your-rights"
            icon={<Globe className="h-5 w-5" />}
            title="7) Your choices & rights"
          >
            <ul className="list-inside list-disc space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>Access, correct, or delete your information (subject to legal requirements).</li>
              <li>Opt out of marketing communications.</li>
              <li>Control cookies via browser settings.</li>
              <li>Request a copy of your data where applicable.</li>
            </ul>
          </Section>

          <Section id="contact" icon={<Mail className="h-5 w-5" />} title="8) Contact">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Questions, requests, or privacy-related concerns can be sent to:
            </p>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="font-semibold">Privacy Team</p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Email: privacy@yourdomain.com
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Address: 123 Example Street, City, Country
              </p>
            </div>
          </Section>

          <footer className="pt-2 text-xs text-slate-500 dark:text-slate-400">
            <p>
              Note: This template is for general informational purposes and is not legal advice. For
              compliance needs (GDPR/CCPA/etc.), consult qualified counsel.
            </p>
          </footer>
        </article>

        {/* Sidebar (TOC) */}
        <aside className="sticky top-24 hidden h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:block">
          <p className="text-sm font-semibold">On this page</p>
          <nav className="mt-3 space-y-2 text-sm">
            <TocLink href="#overview" label="Overview" />
            <TocLink href="#data-we-collect" label="Information we collect" />
            <TocLink href="#how-we-use" label="How we use info" />
            <TocLink href="#cookies" label="Cookies" />
            <TocLink href="#sharing" label="Sharing" />
            <TocLink href="#security" label="Security" />
            <TocLink href="#your-rights" label="Your rights" />
            <TocLink href="#contact" label="Contact" />
          </nav>
        </aside>
      </main>

      {/* Mobile TOC */}
      <div className="lg:hidden">
        <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm font-semibold">Jump to</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <MobileChip href="#overview" label="Overview" />
              <MobileChip href="#data-we-collect" label="Data" />
              <MobileChip href="#how-we-use" label="Usage" />
              <MobileChip href="#cookies" label="Cookies" />
              <MobileChip href="#sharing" label="Sharing" />
              <MobileChip href="#security" label="Security" />
              <MobileChip href="#your-rights" label="Rights" />
              <MobileChip href="#contact" label="Contact" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 text-xs text-slate-500 dark:text-slate-400 sm:px-6">
          <p>© {new Date().getFullYear()} BiteUI. All rights reserved.</p>
          <p>Build calmer launches with BiteUI.</p>
        </div>
      </footer>
    </div>
  )
}

function Section({ id, icon, title, children }: SectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-7"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoCard({ title, items }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
      <p className="font-semibold">{title}</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700 dark:text-slate-300">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  )
}

function MiniCard({ title, desc }: MiniCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/40">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  )
}

function TocLink({ href, label }: TocLinkProps) {
  return (
    <a
      href={href}
      className="block rounded-xl px-3 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
    >
      {label}
    </a>
  )
}

function MobileChip({ href, label }: MobileChipProps) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-950"
    >
      {label}
    </a>
  )
}
