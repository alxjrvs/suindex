import React from 'react'
import type { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component that catches errors in child components
 * Prevents the entire app from crashing due to component errors
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-[var(--color-su-white)]">
          <div className="max-w-md w-full p-6 bg-[var(--color-su-light-blue)] rounded-lg shadow-lg border border-[var(--color-su-brick)]">
            <h1 className="text-2xl font-bold text-[var(--color-su-brick)] mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-[var(--color-su-black)] mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <details className="mb-4 p-3 bg-[var(--color-su-white)] rounded border border-[var(--color-su-light-orange)]">
              <summary className="cursor-pointer font-semibold text-[var(--color-su-black)]">
                Error Details
              </summary>
              <pre className="mt-2 text-xs text-[var(--color-su-brick)] overflow-auto max-h-40">
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-[var(--color-su-orange)] text-[var(--color-su-white)] rounded-lg hover:bg-[var(--color-su-brick)] transition-colors font-medium"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
