import { Suspense } from "react"
import { I18nextProvider } from "react-i18next"

import { i18n } from "@/lib/i18n"
import { Toaster } from "@/ui/components/base/sonner"
import { Loading } from "@/ui/components/loading"

import { ErrorBoundary } from "./error"
import { AuthProvider } from "./providers/auth-provider"
import { QueryProvider } from "./providers/query-provider"
import { ThemeProvider } from "./providers/theme-provider"
import { Router } from "./router"

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <Toaster position="top-center" richColors />
            <ErrorBoundary>
              <Suspense fallback={<Loading />}>
                <Router />
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default App
