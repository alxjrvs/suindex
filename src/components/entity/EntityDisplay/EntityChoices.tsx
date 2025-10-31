import { Box, VStack } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import type { SURefMetaChoice, SURefMetaEntity, SURefSchemaName } from 'salvageunion-reference'
import { EntityChoice } from './EntityChoice'

export interface EntityChoicesProps {
  data: SURefMetaEntity
  schemaName: SURefSchemaName | 'actions'
  compact: boolean
  /** Choices object matching the format sent to the API: Record<choiceId, "schemaName||entityId"> */
  choices?: Record<string, string> | null
  /** Callback when a choice is selected - if undefined, we're in schema page mode (not a live sheet) */
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
}

export function EntityChoices({ data, compact, choices, onChoiceSelection }: EntityChoicesProps) {
  // Extract choices from the entity data
  const entityChoices: SURefMetaChoice[] = ('choices' in data && data.choices) || []

  // If no choices in the entity, don't render anything
  if (entityChoices.length === 0) {
    return null
  }

  // If onChoiceSelection is undefined, we're in schema page mode (not a live sheet)
  const isSchemaPageMode = onChoiceSelection === undefined

  // Handler for choice changes
  const handleChoiceChange = (choiceId: string, value: string) => {
    if (onChoiceSelection) {
      onChoiceSelection(choiceId, value || undefined)
    }
  }

  if (!isSchemaPageMode) {
    // Live sheet mode - show WIP for now
    return (
      <Box p={compact ? 2 : 3} bg="su.lightBlue" borderRadius="md">
        <Text fontSize={compact ? 'sm' : 'md'} fontWeight="bold" color="su.black">
          WIP - Live sheet choices will be displayed here
        </Text>
      </Box>
    )
  }

  // Schema page mode - show all available options
  return (
    <VStack gap={compact ? 2 : 3} alignItems="stretch" px="2">
      {entityChoices.map((choice) => {
        return (
          <EntityChoice
            key={choice.id}
            choice={choice}
            compact={compact}
            choices={choices}
            onChoiceSelection={onChoiceSelection}
            handleChoiceChange={handleChoiceChange}
          />
        )
      })}
    </VStack>
  )
}
