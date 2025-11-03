import { type ReactNode } from 'react'
import { Box, HStack, Spinner } from '@chakra-ui/react'
import { RoundedBox } from './RoundedBox'

interface ControlBarContainerProps {
  backgroundColor: string
  leftContent?: ReactNode
  rightContent?: ReactNode
  hasPendingChanges?: boolean
  centerContent?: ReactNode
}

export function ControlBarContainer({
  backgroundColor,
  leftContent,
  rightContent,
  hasPendingChanges = false,
  centerContent,
}: ControlBarContainerProps) {
  // Save status indicator component
  const saveStatusIndicator = (
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
  )

  return (
    <RoundedBox
      bg={backgroundColor}
      px={6}
      py={3}
      leftContent={leftContent ? <HStack gap={4}>{leftContent}</HStack> : undefined}
      rightContent={
        <HStack gap={3}>
          {centerContent}
          {rightContent}
          {saveStatusIndicator}
        </HStack>
      }
    />
  )
}
