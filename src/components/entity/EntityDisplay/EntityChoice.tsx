import { Box, Grid, HStack, Button } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import type { SURefMetaChoice } from 'salvageunion-reference'
import { lazy, Suspense } from 'react'
import { getModel } from '../../../utils/modelMap'
import { SheetInput } from '../../shared/SheetInput'
import { EntitySubheader } from './EntitySubheader'

const EntityDisplay = lazy(() =>
  import('./index').then((module) => ({ default: module.EntityDisplay }))
)

interface EntityChoiceProps {
  choice: SURefMetaChoice
  compact: boolean
  choices?: Record<string, string> | null
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
  handleChoiceChange: (choiceId: string, value: string) => void
  premadeChoice?: { id: string; value: string }
}

export function EntityChoice({
  choice,
  compact,
  choices,
  onChoiceSelection,
  handleChoiceChange,
}: EntityChoiceProps) {
  const hasSchemaEntities = 'schemaEntities' in choice && choice.schemaEntities
  const hasCustomSystemOptions = 'customSystemOptions' in choice && choice.customSystemOptions
  const hasSchema = 'schema' in choice && choice.schema && choice.schema.length > 0
  const selectedChoice = choices?.[choice.id]

  // Simple choice = only has id, name, and/or description (no schema, no schema entities, no custom options)
  const isSimpleChoice = !hasSchema && !hasSchemaEntities && !hasCustomSystemOptions

  // If no onChoiceSelection and we have a premadeChoice, use it
  const isSchemaPageMode = onChoiceSelection === undefined
  const hasLimitedChoices = hasSchemaEntities || hasCustomSystemOptions

  return (
    <Box>
      {/* Only show label for non-simple choices */}
      {!isSimpleChoice && (
        <HStack mb={2} gap={2}>
          <EntitySubheader disabled={isSchemaPageMode} compact={compact} label={choice.name} />
          {hasLimitedChoices && !selectedChoice && (
            <Text fontSize={compact ? 'xs' : 'sm'} color="su.black" opacity={0.7}>
              (choose)
            </Text>
          )}
        </HStack>
      )}

      {/* Render schemaEntities if available */}
      {hasSchemaEntities && choice.schemaEntities && (
        <Grid
          templateColumns={`repeat(${Math.min(choice.schemaEntities.length, 3)}, 1fr)`}
          gap={compact ? 1 : 2}
          alignItems="start"
        >
          {choice.schemaEntities.map((entityName, idx) => {
            const schema = choice.schema?.[0]
            if (!schema) return null

            const model = getModel(schema.toLowerCase())
            if (!model) return null

            const entity = model.find((e) => e.name === entityName)
            if (!entity) return null

            return (
              <Suspense key={idx} fallback={<Box>Loading...</Box>}>
                <EntityDisplay data={entity} schemaName="actions" compact collapsible={false} />
              </Suspense>
            )
          })}
        </Grid>
      )}

      {/* Render schema-based choice with premade selection (schema page mode only) */}
      {isSchemaPageMode &&
        choices &&
        hasSchema &&
        !hasSchemaEntities &&
        !hasCustomSystemOptions && (
          <Box>
            {(() => {
              console.log('bar')
              const schema = choice.schema?.[0]
              if (!schema) return null

              const model = getModel(schema.toLowerCase())
              if (!model) return null

              const entity = model.find((e) => e.name === selectedChoice)
              if (!entity) return null

              return (
                <Suspense fallback={<Box>Loading...</Box>}>
                  <EntityDisplay data={entity} schemaName="actions" compact collapsible={false} />
                </Suspense>
              )
            })()}
          </Box>
        )}

      {/* Render customSystemOptions if available */}
      {hasCustomSystemOptions &&
        choice.customSystemOptions &&
        (() => {
          // Filter options based on premade choice
          const premadeChoice = choices?.[choice.id]
          const visibleOptions = premadeChoice
            ? choice.customSystemOptions.filter((option) => option.name === premadeChoice)
            : choice.customSystemOptions

          return (
            <Grid
              templateColumns={`repeat(${Math.min(visibleOptions.length, 3)}, 1fr)`}
              gap={compact ? 1 : 2}
              alignItems="start"
            >
              {visibleOptions.map((option, idx) => (
                <Suspense key={idx} fallback={<Box>Loading...</Box>}>
                  <EntityDisplay data={option} schemaName="actions" compact />
                </Suspense>
              ))}
            </Grid>
          )
        })()}

      {/* Render input field for simple choices */}
      {isSimpleChoice && (
        <SheetInput
          label={choice.name}
          value={choices?.[choice.id] || ''}
          onChange={(value) => handleChoiceChange(choice.id, value)}
          onDiceRoll={() => {}}
          placeholder={choice.description || 'Enter value...'}
          disabled={onChoiceSelection === undefined}
          diceRollTitle={choice.rollTable}
        />
      )}

      {/* Render button for choices with only schema names (no specific entities) - only if no premade choice */}
      {hasSchema && !hasSchemaEntities && !hasCustomSystemOptions && (
        <Button
          onClick={() => {
            alert('Choice selection not yet implemented')
          }}
          disabled={isSchemaPageMode}
          width="full"
        >
          Add a {choice.schema?.join(' / ')}
        </Button>
      )}
    </Box>
  )
}
