"use client"

import React, { Component, ReactNode, ComponentType } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

// --- Interfaces ---

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: ReactNode
  // Fallback component signature is explicitly typed for clarity
  fallback?: ComponentType<{ error?: Error; resetError: () => void }>
}

// --- Error Boundary Component ---

/**
 * A standard React Error Boundary implemented using a class component.
 * It catches JavaScript errors anywhere in its child component tree, logs them,
 * and displays a fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Define defaultProps for optional props
  static defaultProps = {
    fallback: DefaultErrorFallback,
  }

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: undefined }
  }

  /**
   * Updates state so the next render shows the fallback UI.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Log the high-level error immediately
    console.error("[ErrorBoundary] Fatal error detected in component tree:", error.name, error.message)
    return { hasError: true, error }
  }

  /**
   * Catches errors and sends them to an error reporting service (e.g., Sentry).
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Detailed logging for development/debugging
    console.error("[ErrorBoundary] Component stack trace:", errorInfo.componentStack)
    // Production ready: Add error reporting service call here (e.g., log.send(error, errorInfo))
  }

  /**
   * Resets the error state, allowing the boundary to re-render children.
   */
  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    const { hasError, error } = this.state
    const { children } = this.props

    if (hasError) {
      // FIX: Use non-null assertion operator (!) on this.props.fallback.
      // TypeScript now trusts that due to defaultProps, fallback will always be defined here.
      const FallbackComponent = this.props.fallback!;

      return <FallbackComponent error={error} resetError={this.resetError} />
    }

    return children
  }
}

// --- Default Fallback UI ---

/**
 * The standard UI component displayed when an error is caught.
 */
function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full shadow-2xl border-destructive/50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Application Crashed</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground text-base">
            We encountered an unexpected error. You can try to reset the component state or refresh the entire page.
          </p>
          {error && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm font-medium text-destructive hover:text-destructive/80 transition-colors">
                View Technical Details
              </summary>
              <pre className="mt-3 text-xs bg-destructive/5 text-destructive-foreground p-3 rounded-lg overflow-auto border border-destructive/20 max-h-32">
                {error.stack || error.message}
              </pre>
            </details>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={resetError} variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again (Component Reset)
            </Button>
            <Button onClick={() => window.location.reload()} variant="destructive">
              Refresh Entire Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// --- Supplementary Hook (No change in logic, kept for utility) ---

/**
 * Provides a dedicated function for manually handling errors within functional components (e.g., inside event handlers).
 */
export function useErrorHandler() {
  // In a real application, this is where you'd initialize error reporting client libraries (e.g., Sentry, Bugsnag).
  return (error: Error, errorInfo?: { componentStack: string }) => {
    console.error("[Manual Error Handler] Handled:", error)
    if (errorInfo) {
      console.error("[Manual Error Handler] Info:", errorInfo)
    }
    // Production ready: Log to external service here
  }
}