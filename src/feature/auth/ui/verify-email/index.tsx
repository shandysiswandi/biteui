import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import { routes } from "@/lib/constants/routes"
import { Button } from "@/ui/components/base/button"
import { Spinner } from "@/ui/components/base/spinner"

import { useVerifyEmail } from "../../hooks/use-verify-email"

export default function Page() {
  const { t } = useTranslation()
  const { isInvalid, isVerifying } = useVerifyEmail()

  if (isInvalid) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">{t("auth.verifyEmail.invalid.title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("auth.verifyEmail.invalid.description")}
          </p>
        </div>
        <Button asChild>
          <Link to={routes.auth.login}>{t("auth.common.backToLogin")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">{t("auth.verifyEmail.verifying.title")}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {t("auth.verifyEmail.verifying.description")}
        </p>
      </div>
      {isVerifying && (
        <div className="flex justify-center">
          <Spinner className="size-5" />
        </div>
      )}
    </div>
  )
}
