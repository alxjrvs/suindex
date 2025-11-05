import { Box, VStack } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import type { SURefMetaChoice } from 'salvageunion-reference'
import { EntityChoice } from './EntityChoice'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export interface EntityChoicesProps {
  /** User choices object matching the format sent to the API: Record<choiceId, "schemaName||entityId"> */
  userChoices?: Record<string, string> | null
  /** Callback when a choice is selected - if undefined, we're in schema page mode (not a live sheet) */
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
}

export function EntityChoices({ userChoices, onChoiceSelection }: EntityChoicesProps) {
  const { data, spacing, fontSize } = useEntityDisplayContext()
  // Extract choices from the entity data
  const entityChoices: SURefMetaChoice[] = ('choices' in data && data.choices) || []

  // If no choices in the entity, don't render anything
  if (entityChoices.length === 0) {
    return null
  }

  // If onChoiceSelection is undefined, we're in schema page mode (not a live sheet)
  const isSchemaPageMode = onChoiceSelection === undefined

  if (!isSchemaPageMode) {
    // Live sheet mode - show WIP for now
    return (
      <Box p={spacing.contentPadding} bg="su.lightBlue" borderRadius="md">
        <Text fontSize={fontSize.md} fontWeight="bold" color="su.black">
          WIP - Live sheet choices will be displayed here
        </Text>
      </Box>
    )
  }

  return (
    <VStack gap={spacing.smallGap} alignItems="stretch" px="2">
      {entityChoices.map((choice) => {
        return (
          <EntityChoice
            key={choice.id}
            choice={choice}
            userChoices={userChoices}
            onChoiceSelection={onChoiceSelection}
          />
        )
      })}
    </VStack>
  )
}
