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

  const isSimpleChoice = !hasSchema && !hasSchemaEntities && !hasCustomSystemOptions

  const isSchemaPageMode = onChoiceSelection === undefined
  const hasLimitedChoices = hasSchemaEntities || hasCustomSystemOptions

  return (
    <Box>
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

      {isSchemaPageMode &&
        userChoices &&
        hasSchema &&
        !hasSchemaEntities &&
        !hasCustomSystemOptions && (
          <PreselectedEntityDisplay choice={choice} selectedChoice={selectedChoice} />
        )}

      {(hasSchemaEntities || hasCustomSystemOptions) && (
        <EntityListDisplay
          choice={choice}
          selectedChoice={selectedChoice}
          userChoices={userChoices}
          onChoiceSelection={onChoiceSelection}
        />
      )}

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
