import { type ReactNode } from 'react'
import { Box, HStack, Spinner } from '@chakra-ui/react'

interface ControlBarContainerProps {
  backgroundColor: string
  leftContent: ReactNode
  rightContent?: ReactNode
  hasPendingChanges?: boolean
}

export function ControlBarContainer({
  backgroundColor,
  leftContent,
  rightContent,
  hasPendingChanges = false,
}: ControlBarContainerProps) {
  return (
    <Box
      borderWidth="4px"
      borderRadius="3xl"
      px={6}
      py={3}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bg={backgroundColor}
      borderColor={backgroundColor}
    >
      {/* Left side: Assignment dropdowns */}
      <HStack gap={4}>{leftContent}</HStack>

      {/* Right side: Link buttons and save status indicator */}
      <HStack gap={3}>
        {rightContent}

        {/* Save status indicator */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w={6}
          h={6}
          aria-label={hasPendingChanges ? 'Saving changes...' : 'All changes saved'}
        >
          {hasPendingChanges ? (
            <Spinner size="sm" color="white" />
          ) : (
            <Box
              w={3}
              h={3}
              borderRadius="full"
              bg="green.400"
              boxShadow="0 0 8px rgba(72, 187, 120, 0.6)"
            />
          )}
        </Box>
      </HStack>
    </Box>
  )
}
