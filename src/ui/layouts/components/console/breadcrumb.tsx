import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router"

import { routes } from "@/lib/constants/routes"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/components/base/breadcrumb"

export function MainBreadcrumb() {
  const location = useLocation()
  const { t } = useTranslation()
  const segments = location.pathname.split("/").filter(Boolean)
  const isAppRoute = segments[0] === "app"
  const breadcrumbSegments = isAppRoute ? segments.slice(1) : segments
  const basePath = isAppRoute ? "/app" : ""
  const segmentLabelKeys: Record<string, string> = {
    dashboard: "console.breadcrumb.dashboard",
    feature1: "console.breadcrumb.feature1",
    feature2: "console.breadcrumb.feature2",
    page1: "console.breadcrumb.page1",
    page2: "console.breadcrumb.page2",
    user: "console.breadcrumb.user",
    profile: "console.breadcrumb.profile",
    notifications: "console.breadcrumb.notifications",
    settings: "console.breadcrumb.settings",
    management: "console.breadcrumb.management",
    users: "console.breadcrumb.users",
    iam: "console.breadcrumb.iam",
  }
  const formatLabel = (segment: string) =>
    segment
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  const resolveLabel = (segment: string) => {
    const key = segmentLabelKeys[segment]
    return key ? t(key) : formatLabel(segment)
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem
          className={breadcrumbSegments.length === 0 ? undefined : "hidden md:inline-flex"}
        >
          <BreadcrumbLink asChild>
            <Link to={routes.dashboard}>{t("console.breadcrumb.application")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbSegments.map((segment, index) => {
          const isLast = index === breadcrumbSegments.length - 1
          const pathSuffix = breadcrumbSegments.slice(0, index + 1).join("/")
          const path = `${basePath}/${pathSuffix}`

          return (
            <Fragment key={path}>
              <BreadcrumbSeparator className="hidden md:list-item" />
              <BreadcrumbItem className={isLast ? undefined : "hidden md:inline-flex"}>
                {isLast ? (
                  <BreadcrumbPage>{resolveLabel(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={path}>{resolveLabel(segment)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
