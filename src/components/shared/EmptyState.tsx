import { Flex, VStack, Text, Button } from '@chakra-ui/react'

interface EmptyStateProps {
  title?: string
  message?: string
  minHeight?: string | number
  actionLabel?: string
  onAction?: () => void
  showActionButton?: boolean
}

/**
 * Reusable empty state component
 * Used when no data is available to display
 *
 * @example
 * ```tsx
 * {items.length === 0 && (
 *   <EmptyState
 *     title="No items found"
 *     message="Create your first item to get started"
 *     actionLabel="Create Item"
 *     onAction={handleCreate}
 *   />
 * )}
 * ```
 */
export function EmptyState({
  title = 'No items',
  message = 'Nothing to display',
  minHeight = '64',
  actionLabel = 'Create',
  onAction,
  showActionButton = !!onAction,
}: EmptyStateProps) {
  return (
    <Flex alignItems="center" justifyContent="center" minH={minHeight}>
      <VStack textAlign="center" gap={4}>
        <Text fontSize="xl" fontFamily="mono" color="su.black" fontWeight="bold">
          {title}
        </Text>
        <Text fontSize="sm" fontFamily="mono" color="su.grey">
          {message}
        </Text>
        {showActionButton && onAction && (
          <Button
            onClick={onAction}
            bg="su.orange"
            color="su.white"
            fontWeight="bold"
            py={2}
            px={6}
            _hover={{ bg: 'su.brick' }}
          >
            {actionLabel}
          </Button>
        )}
      </VStack>
    </Flex>
  )
}
