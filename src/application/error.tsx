import { Component, type ErrorInfo, type ReactNode } from "react"
import { Link } from "react-router"

import { routes } from "@/lib/constants/routes"
import { Button } from "@/ui/components/base/button"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex min-h-screen flex-col items-center justify-center space-y-6 text-center"
          data-testid="error-boundary-fallback"
        >
          <h1 className="text-9xl font-extrabold text-red-500">500</h1>
          <h2 className="text-3xl font-bold">Oops, Something Went Wrong</h2>
          <p className="text-muted-foreground max-w-md text-lg">
            We apologize for the inconvenience. Please try refreshing the page, or contact support
            if the problem persists.
          </p>
          <Button asChild>
            <Link to={routes.public.home}>Go Back Home</Link>
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
