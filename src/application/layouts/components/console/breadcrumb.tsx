import { Fragment } from "react"
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
  const segments = location.pathname.split("/").filter(Boolean)
  const isAppRoute = segments[0] === "app"
  const breadcrumbSegments = isAppRoute ? segments.slice(1) : segments
  const basePath = isAppRoute ? "/app" : ""
  const formatLabel = (segment: string) =>
    segment
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  const resolveLabel = (segment: string) => formatLabel(segment)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem
          className={breadcrumbSegments.length === 0 ? undefined : "hidden md:inline-flex"}
        >
          <BreadcrumbLink asChild>
            <Link to={routes.dashboard}>Application</Link>
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
