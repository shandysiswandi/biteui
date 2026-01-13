import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router"

import { routes } from "@/lib/constants/routes"
import { Button } from "@/ui/components/base/button"

export function ResetPasswordSuccess() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("auth.resetPassword.success.title")}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {t("auth.resetPassword.success.description")}
        </p>
      </div>
      <Button asChild>
        <Link to={routes.auth.login} state={location.state}>
          {t("auth.common.backToLogin")}
        </Link>
      </Button>
    </div>
  )
}
