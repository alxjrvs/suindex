import { Box, HStack } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import type { SURefMetaChoice } from 'salvageunion-reference'
import { SheetInput } from '../../shared/SheetInput'
import { EntitySubheader } from './EntitySubheader'
import { EntityListDisplay } from './EntityListDisplay'
import { PreselectedEntityDisplay } from './PreselectedEntityDisplay'
import { useEntityDisplayContext } from './useEntityDisplayContext'

interface EntityChoiceProps {
  choice: SURefMetaChoice
  userChoices?: Record<string, string> | null
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
}

export function EntityChoice({ choice, userChoices, onChoiceSelection }: EntityChoiceProps) {
  const { fontSize } = useEntityDisplayContext()
  const hasSchemaEntities = 'schemaEntities' in choice && choice.schemaEntities
  const hasCustomSystemOptions = 'customSystemOptions' in choice && choice.customSystemOptions
  const hasSchema = 'schema' in choice && choice.schema && choice.schema.length > 0
  const selectedChoice = userChoices?.[choice.id]

  // Simple choice = only has id, name, and/or description (no schema, no schema entities, no custom options)
  const isSimpleChoice = !hasSchema && !hasSchemaEntities && !hasCustomSystemOptions

  // Schema page mode = no onChoiceSelection handler (viewing reference data, not editing)
  const isSchemaPageMode = onChoiceSelection === undefined
  const hasLimitedChoices = hasSchemaEntities || hasCustomSystemOptions

  return (
    <Box>
      {/* Only show label for non-simple choices */}
      {!isSimpleChoice && (
        <HStack mb={2} gap={2}>
          <EntitySubheader disabled={isSchemaPageMode} label={choice.name} />
          {hasLimitedChoices && !selectedChoice && (
            <Text fontSize={fontSize.sm} color="su.black" opacity={0.7}>
              (choose one)
            </Text>
          )}
        </HStack>
      )}

      {/* Render schema-based choice with premade selection (schema page mode only) */}
      {isSchemaPageMode &&
        userChoices &&
        hasSchema &&
        !hasSchemaEntities &&
        !hasCustomSystemOptions && (
          <PreselectedEntityDisplay choice={choice} selectedChoice={selectedChoice} />
        )}

      {/* Render entity list (schemaEntities or customSystemOptions) */}
      {(hasSchemaEntities || hasCustomSystemOptions) && (
        <EntityListDisplay
          choice={choice}
          selectedChoice={selectedChoice}
          userChoices={userChoices}
          onChoiceSelection={onChoiceSelection}
        />
      )}

      {/* Render input field for simple choices */}
      {isSimpleChoice && (
        <SheetInput
          label={choice.name}
          value={userChoices?.[choice.id] || ''}
          onChange={(value) => onChoiceSelection?.(choice.id, value)}
          onDiceRoll={() => {}}
          placeholder={choice.description || 'Enter value...'}
          disabled={onChoiceSelection === undefined}
          diceRollTitle={choice.rollTable}
        />
      )}
    </Box>
  )
}
