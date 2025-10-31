import { Box } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import type { EntityDisplaySubProps } from './types'

interface EntityChoicesProps extends EntityDisplaySubProps {
  /** Choices object matching the format sent to the API: Record<choiceId, "schemaName||entityId"> */
  choices?: Record<string, string> | null
}

export function EntityChoices({ data, schemaName, compact, choices }: EntityChoicesProps) {
  // If no choices provided, don't render anything
  if (!choices || Object.keys(choices).length === 0) {
    return null
  }

  return (
    <Box p={compact ? 2 : 3} bg="su.lightBlue" borderRadius="md">
      <Text fontSize={compact ? 'sm' : 'md'} fontWeight="bold" color="su.black">
        WIP - Choices will be displayed here
      </Text>
    </Box>
  )
}

