import { Flex, Text, Spinner } from '@chakra-ui/react'

interface LoadingStateProps {
  message?: string
  minHeight?: string | number
  showSpinner?: boolean
}

/**
 * Reusable loading state component
 * Eliminates repeated loading UI patterns across components
 *
 * @example
 * ```tsx
 * {loading && <LoadingState message="Loading pilot..." />}
 * ```
 */
export function LoadingState({
  message = 'Loading...',
  minHeight = '64',
  showSpinner = true,
}: LoadingStateProps) {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      minH={minHeight}
      flexDirection="column"
      gap={4}
    >
      {showSpinner && <Spinner size="lg" />}
      <Text fontSize="lg" fontFamily="mono" color="su.black">
        {message}
      </Text>
    </Flex>
  )
}
