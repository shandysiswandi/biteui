import { lazy, type ComponentType, type JSX } from "react"
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router"

import { usePermission } from "@/lib/auth/permissions"
import { actions, permissions } from "@/lib/constants/permissions"
import { protectedPrefixes, routes } from "@/lib/constants/routes"
import { useAuthStore } from "@/lib/stores/auth-store"
import AuthLayout from "@/ui/layouts/auth"
import ConsoleLayout from "@/ui/layouts/console"

const GlobalNotFound = lazy(() => import("../ui/pages/global-not-found"))
const ConsoleNotFound = lazy(() => import("../ui/pages/console-not-found"))
const ConsoleForbidden = lazy(() => import("../ui/pages/console-forbidden"))

const GuestOnly = () => {
  const accessToken = useAuthStore((state) => state.accessToken)

  if (accessToken) {
    return <Navigate to={routes.dashboard} replace />
  }

  return <Outlet />
}

const MemberOnly = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const location = useLocation()

  if (!accessToken) {
    return (
      <Navigate
        to={routes.auth.login}
        replace
        state={{
          from: {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
          },
        }}
      />
    )
  }

  return <Outlet />
}

const PermissionGuard = ({
  permission,
  action = "read",
}: {
  permission: string
  action?: string
}) => {
  const can = usePermission()

  if (!can(permission, action)) {
    return <ConsoleForbidden />
  }

  return <Outlet />
}

const NotFoundGate = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const location = useLocation()

  if (
    !protectedPrefixes.some(
      (prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`),
    )
  ) {
    return <GlobalNotFound />
  }

  if (!accessToken) {
    return (
      <Navigate
        to={routes.auth.login}
        replace
        state={{
          from: {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
          },
        }}
      />
    )
  }

  return (
    <ConsoleLayout>
      <ConsoleNotFound />
    </ConsoleLayout>
  )
}

type RouteItem =
  | {
      wrappers: ComponentType[]
      children: RouteItem[]
    }
  | {
      path: string
      element: ComponentType
      permission?: string
      action?: string
      children?: RouteItem[]
    }
  | {
      index: true
      element: ComponentType
      permission?: string
      action?: string
      children?: RouteItem[]
    }

const renderRoutes = (items: RouteItem[]): JSX.Element[] =>
  items.map((item, routeIndex): JSX.Element => {
    if ("wrappers" in item) {
      const { wrappers, children } = item
      const routeChildren = renderRoutes(children)
      const wrappedRoutes = wrappers.reduceRight<JSX.Element[]>(
        (acc, Wrapper, wrapperIndex) => [
          <Route key={`wrapper-${routeIndex}-${wrapperIndex}`} element={<Wrapper />}>
            {acc}
          </Route>,
        ],
        routeChildren,
      )

      return wrappedRoutes[0]
    }

    const { element: Component, children, permission, action } = item

    if ("index" in item) {
      const indexRoute = <Route key={`index-${routeIndex}`} index element={<Component />} />

      if (!permission) {
        return indexRoute
      }

      return (
        <Route
          key={`guard-${routeIndex}`}
          element={<PermissionGuard permission={permission} action={action} />}
        >
          {indexRoute}
        </Route>
      )
    }

    const routeChildren = children ? renderRoutes(children) : null

    const pathRoute = (
      <Route key={item.path} path={item.path} element={<Component />}>
        {routeChildren}
      </Route>
    )

    if (!permission) {
      return pathRoute
    }

    return (
      <Route
        key={`guard-${routeIndex}`}
        element={<PermissionGuard permission={permission} action={action} />}
      >
        {pathRoute}
      </Route>
    )
  })

const allRoutes: RouteItem[] = [
  // public
  {
    index: true,
    element: lazy(() => import("../feature/public/home/view")),
  },
  {
    path: routes.public.privacy,
    element: lazy(() => import("../feature/public/privacy/view")),
  },
  {
    path: routes.public.terms,
    element: lazy(() => import("../feature/public/terms/view")),
  },
  // auth
  {
    wrappers: [GuestOnly, AuthLayout],
    children: [
      {
        path: routes.auth.login,
        element: lazy(() => import("../feature/auth/ui/login")),
      },
      {
        path: routes.auth.register,
        element: lazy(() => import("../feature/auth/ui/register")),
      },
      {
        path: routes.auth.forgotPassword,
        element: lazy(() => import("../feature/auth/ui/forgot-password")),
      },
      {
        path: routes.auth.resetPassword,
        element: lazy(() => import("../feature/auth/ui/reset-password")),
      },
      {
        path: routes.auth.verifyEmail,
        element: lazy(() => import("../feature/auth/ui/verify-email")),
      },
    ],
  },
  // app
  {
    wrappers: [MemberOnly, ConsoleLayout],
    children: [
      {
        path: routes.dashboard,
        element: lazy(() => import("../feature/dashboard/ui/dashboard")),
      },
      // user related
      {
        path: routes.user.profile,
        element: lazy(() => import("../feature/user/profile/view")),
      },
      {
        path: routes.user.notifications,
        element: lazy(() => import("../feature/user/notification/view")),
      },
      {
        path: routes.user.settings,
        element: lazy(() => import("../feature/user/setting/view")),
      },
      // managements related
      {
        path: routes.management.users,
        element: lazy(() => import("../feature/management/ui/users")),
        permission: permissions.management.users,
        action: actions.read,
      },
      {
        path: routes.management.iam,
        element: lazy(() => import("../feature/management/ui/iam")),
        permission: permissions.management.users,
        action: actions.read,
      },
    ],
  },
  {
    path: "*",
    element: NotFoundGate,
  },
]

export function Router() {
  return (
    <BrowserRouter>
      <Routes>{renderRoutes(allRoutes)}</Routes>
    </BrowserRouter>
  )
}
