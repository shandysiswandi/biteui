import { lazy } from "react"
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router"

import { protectedPrefixes, routes } from "@/lib/constants/routes"
import { useAuthStore } from "@/lib/stores/auth-store"
import AuthLayout from "@/ui/layouts/auth"
import MainLayout from "@/ui/layouts/main"

const Home = lazy(() => import("../feature/root/home"))
const NotFound = lazy(() => import("../feature/root/global-not-found"))
const MainNotFound = lazy(() => import("../feature/root/main-not-found"))

const isProtectedPath = (pathname: string) =>
  protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

const getRedirectState = (location: ReturnType<typeof useLocation>) => ({
  from: {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  },
})

const GuestOnly = () => {
  const accessToken = useAuthStore((state) => state.accessToken)

  if (accessToken) {
    return <Navigate to={routes.home} replace />
  }

  return <Outlet />
}

const RequireAuth = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const location = useLocation()

  if (!accessToken) {
    return (
      <Navigate
        to={routes.auth.login}
        replace
        state={getRedirectState(location)}
      />
    )
  }

  return <Outlet />
}

const NotFoundGate = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const location = useLocation()

  if (!isProtectedPath(location.pathname)) {
    return <NotFound />
  }

  if (!accessToken) {
    return (
      <Navigate
        to={routes.auth.login}
        replace
        state={getRedirectState(location)}
      />
    )
  }

  return (
    <MainLayout>
      <MainNotFound />
    </MainLayout>
  )
}

const authRoutes = [
  {
    path: routes.auth.login,
    element: lazy(() => import("../feature/auth/login/view")),
  },
  {
    path: routes.auth.register,
    element: lazy(() => import("../feature/auth/register/view")),
  },
  {
    path: routes.auth.forgotPassword,
    element: lazy(() => import("../feature/auth/forgot-password/view")),
  },
]

const protectedRoutes = [
  {
    path: routes.dashboard,
    element: lazy(() => import("../feature/dashboard/ui")),
  },
  {
    path: routes.me.profile,
    element: lazy(() => import("../feature/me/profile/view")),
  },
  {
    path: routes.me.notification,
    element: lazy(() => import("../feature/me/notification/view")),
  },
  {
    path: routes.me.setting,
    element: lazy(() => import("../feature/me/setting/view")),
  },
]

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />

        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            {protectedRoutes.map(({ path, element: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
        </Route>

        <Route element={<GuestOnly />}>
          <Route element={<AuthLayout />}>
            {authRoutes.map(({ path, element: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
        </Route>

        <Route path="*" element={<NotFoundGate />} />
      </Routes>
    </BrowserRouter>
  )
}
