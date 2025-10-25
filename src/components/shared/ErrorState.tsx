import { Flex, VStack, Text, Button } from '@chakra-ui/react'

interface ErrorStateProps {
  title?: string
  message?: string
  minHeight?: string | number
  onRetry?: () => void
  showRetryButton?: boolean
}

/**
 * Reusable error state component
 * Eliminates repeated error UI patterns across components
 *
 * @example
 * ```tsx
 * {error && (
 *   <ErrorState
 *     title="Error loading pilot"
 *     message={error}
 *     onRetry={reload}
 *   />
 * )}
 * ```
 */
export function ErrorState({
  title = 'Error',
  message = 'An error occurred',
  minHeight = '64',
  onRetry,
  showRetryButton = !!onRetry,
}: ErrorStateProps) {
  return (
    <Flex alignItems="center" justifyContent="center" minH={minHeight}>
      <VStack textAlign="center" gap={4}>
        <Text fontSize="xl" fontFamily="mono" color="su.brick" fontWeight="bold">
          {title}
        </Text>
        <Text fontSize="sm" fontFamily="mono" color="su.black">
          {message}
        </Text>
        {showRetryButton && onRetry && (
          <Button
            onClick={onRetry}
            bg="su.orange"
            color="su.white"
            fontWeight="bold"
            py={2}
            px={6}
            _hover={{ bg: 'su.brick' }}
          >
            Retry
          </Button>
        )}
      </VStack>
    </Flex>
  )
}
