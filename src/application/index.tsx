import { Suspense } from "react"

import { Toaster } from "@/ui/components/base/sonner"
import { Loading } from "@/ui/components/loading"

import { ErrorBoundary } from "./error"
import { AuthProvider } from "./providers/auth-provider"
import { QueryProvider } from "./providers/query-provider"
import { ThemeProvider } from "./providers/theme-provider"
import { Router } from "./router"

function App() {
  return (
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
  )
}

export default App
