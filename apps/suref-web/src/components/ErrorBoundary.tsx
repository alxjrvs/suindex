import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { Heading } from '@/components/base/Heading'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorContext {
  error: Error
  errorInfo: React.ErrorInfo
  userAgent: string
  url: string
  timestamp: string
  userId?: string
}

/**
 * Optional error reporting function
 * Can be configured to send errors to external service (e.g., Sentry)
 * Set via window.reportError or environment variable
 */
function reportError(context: ErrorContext): void {
  // Log to console in all environments
  console.error('Error caught by boundary:', context)

  // Check for custom error reporter (e.g., Sentry)
  if (typeof window !== 'undefined' && (window as any).reportError) {
    try {
      ;(window as any).reportError(context)
    } catch (reportError) {
      console.error('Failed to report error:', reportError)
    }
  }

  // TODO: Add Sentry or other error reporting service integration
  // Example:
  // if (import.meta.env.VITE_SENTRY_DSN) {
  //   Sentry.captureException(context.error, {
  //     contexts: {
  //       react: {
  //         componentStack: context.errorInfo.componentStack,
  //       },
  //     },
  //     user: context.userId ? { id: context.userId } : undefined,
  //   })
  // }
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Collect error context
    const context: ErrorContext = {
      error,
      errorInfo,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timestamp: new Date().toISOString(),
      // TODO: Get userId from auth context if available
      // userId: currentUser?.id,
    }

    // Report error
    reportError(context)

    // Update state with error info for display
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Flex alignItems="center" justifyContent="center" h="100vh" bg="su.white">
          <Box
            maxW="md"
            w="full"
            p={6}
            bg="su.lightBlue"
            borderRadius="md"
            shadow="lg"
            borderWidth="2px"
            borderColor="su.brick"
          >
            <Heading level="h1" fontSize="2xl" fontWeight="bold" mb={4}>
              REACTOR OVERLOAD
            </Heading>
            <Text color="su.black" mb={4}>
              An unexpected error occurred. Please try refreshing the page.
            </Text>
            <Box
              as="details"
              mb={4}
              p={3}
              bg="su.white"
              borderRadius="md"
              borderWidth="2px"
              borderColor="su.lightOrange"
            >
              <Text as="summary" cursor="pointer" fontWeight="semibold" color="su.black">
                Error Details
              </Text>
              <Text as="pre" mt={2} fontSize="xs" color="su.brick" overflowY="auto" maxH="40">
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack && (
                  <>
                    {'\n\nComponent Stack:\n'}
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </Text>
            </Box>
            <Button
              onClick={() => window.location.reload()}
              w="full"
              px={4}
              py={2}
              bg="su.orange"
              color="su.white"
              borderRadius="md"
              _hover={{ bg: 'su.brick' }}
              fontWeight="medium"
            >
              Refresh Page
            </Button>
          </Box>
        </Flex>
      )
    }

    return this.props.children
  }
}
