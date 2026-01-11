import { Command } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, Outlet } from "react-router"

export default function AuthLayout() {
  const { t } = useTranslation()

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Command className="size-4" />
            </div>
            BiteUI Inc.
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet />
          </div>
        </div>
      </div>

      <div className="bg-background relative hidden lg:block border-l border-dashed">
        <img
          src="/kind.png"
          alt={t("auth.layout.backgroundAlt")}
          className="absolute inset-0 h-full w-full object-none"
        />
      </div>
    </div>
  )
}
