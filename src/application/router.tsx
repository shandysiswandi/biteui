import { lazy, type ComponentType } from "react"
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
  type LoaderFunctionArgs,
} from "react-router"

import { protectedPrefixes, routes } from "@/lib/constants/routes"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Loading } from "@/ui/components/loading"

import AuthLayout from "./layouts/auth"
import ConsoleLayout from "./layouts/console"

const GlobalNotFound = lazy(() => import("../ui/pages/global-not-found"))
const ConsoleNotFound = lazy(() => import("../ui/pages/console-not-found"))

const buildFrom = (request: LoaderFunctionArgs["request"]) => {
  const url = new URL(request.url)
  const hash = typeof window !== "undefined" ? window.location.hash : ""
  return `${url.pathname}${url.search}${hash}`
}

const requireAuth = ({ request }: LoaderFunctionArgs) => {
  const { accessToken, refreshToken } = useAuthStore.getState()
  if (accessToken || refreshToken) {
    return null
  }

  throw redirect(`${routes.auth.login}?from=${encodeURIComponent(buildFrom(request))}`)
}

const requireGuest = () => {
  const { accessToken, refreshToken } = useAuthStore.getState()
  if (!accessToken && !refreshToken) {
    return null
  }

  throw redirect(routes.dashboard)
}

const notFoundLoader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const pathname = url.pathname

  if (
    !protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  ) {
    throw new Response("Not Found", { status: 404 })
  }

  const { accessToken, refreshToken } = useAuthStore.getState()
  if (accessToken || refreshToken) {
    return null
  }

  throw redirect(`${routes.auth.login}?from=${encodeURIComponent(buildFrom(request))}`)
}

const lazyRoute = (importer: () => Promise<{ default: ComponentType }>) => {
  return async () => {
    const module = await importer()
    return { Component: module.default }
  }
}

const routesConfig = [
  {
    index: true,
    lazy: lazyRoute(() => import("../feature/public/home/view")),
  },
  {
    path: routes.public.privacy,
    lazy: lazyRoute(() => import("../feature/public/privacy/view")),
  },
  {
    path: routes.public.terms,
    lazy: lazyRoute(() => import("../feature/public/terms/view")),
  },
  {
    element: <AuthLayout />,
    loader: requireGuest,
    children: [
      {
        path: routes.auth.login,
        lazy: lazyRoute(() => import("../feature/auth/ui/login")),
      },
      {
        path: routes.auth.register,
        lazy: lazyRoute(() => import("../feature/auth/ui/register")),
      },
      {
        path: routes.auth.forgotPassword,
        lazy: lazyRoute(() => import("../feature/auth/ui/forgot-password")),
      },
      {
        path: routes.auth.resetPassword,
        lazy: lazyRoute(() => import("../feature/auth/ui/reset-password")),
      },
      {
        path: routes.auth.verifyEmail,
        lazy: lazyRoute(() => import("../feature/auth/ui/verify-email")),
      },
    ],
  },
  {
    element: <ConsoleLayout />,
    loader: requireAuth,
    children: [
      {
        path: routes.dashboard,
        lazy: lazyRoute(() => import("../feature/dashboard/ui/dashboard")),
      },
      {
        path: routes.user.profile,
        lazy: lazyRoute(() => import("../feature/user/ui/profile")),
      },
      {
        path: routes.user.notifications,
        lazy: lazyRoute(() => import("../feature/user/ui/notification")),
      },
      {
        path: routes.management.users,
        lazy: lazyRoute(() => import("../feature/management/ui/users")),
      },
      {
        path: routes.management.iam,
        lazy: lazyRoute(() => import("../feature/management/ui/iam")),
      },
    ],
  },
  {
    path: "*",
    element: (
      <ConsoleLayout>
        <ConsoleNotFound />
      </ConsoleLayout>
    ),
    loader: notFoundLoader,
    errorElement: <GlobalNotFound />,
  },
]

const router = createBrowserRouter([
  {
    id: "root",
    element: <Outlet />,
    hydrateFallbackElement: <Loading />,
    children: routesConfig,
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
