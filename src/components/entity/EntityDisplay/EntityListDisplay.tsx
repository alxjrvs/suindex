import { Box, VStack } from '@chakra-ui/react'
import type { SURefMetaChoice } from 'salvageunion-reference'
import { lazy, Suspense } from 'react'
import type { ButtonProps } from '@chakra-ui/react'
import { getModel } from '../../../utils/modelMap'

const EntityDisplay = lazy(() =>
  import('./index').then((module) => ({ default: module.EntityDisplay }))
)

export interface EntityListDisplayProps {
  choice: SURefMetaChoice
  selectedChoice?: string
  compact: boolean
  userChoices?: Record<string, string> | null
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
}

/**
 * Unified component for rendering lists of entities from either schemaEntities or customSystemOptions.
 * Filters to show only the selected entity if selectedChoice is provided.
 * Renders in a vertical stack with collapsible entities.
 */
export function EntityListDisplay({
  choice,
  selectedChoice,
  compact,
  userChoices,
  onChoiceSelection,
}: EntityListDisplayProps) {
  // Get entities from either schemaEntities (via model lookup) or customSystemOptions (direct)
  const entities = choice.schemaEntities
    ? choice.schemaEntities
        .map((entityName) => {
          const schema = choice.schema?.[0]
          if (!schema) return null

          const model = getModel(schema.toLowerCase())
          if (!model) return null

          return model.find((e) => e.name === entityName)
        })
        .filter((e) => e !== null && e !== undefined)
    : choice.customSystemOptions || []

  // Filter to show only selected entity if provided
  const visibleEntities = selectedChoice
    ? entities.filter((entity) => entity.name === selectedChoice)
    : entities

  if (visibleEntities.length === 0) return null

  return (
    <VStack gap={compact ? 1 : 2} alignItems="start">
      {visibleEntities.map((entity, idx) => {
        // Determine button config based on whether onChoiceSelection is defined
        let buttonConfig: (ButtonProps & { children: React.ReactNode }) | undefined

        if (onChoiceSelection) {
          // Check if this entity is already selected in userChoices
          const isSelected = userChoices?.[choice.id] !== undefined

          if (isSelected) {
            // Show REMOVE button
            buttonConfig = {
              bg: 'su.brick',
              color: 'su.white',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              _hover: { bg: 'su.black' },
              onClick: (e) => {
                e.stopPropagation()
                onChoiceSelection(choice.id, undefined)
              },
              children: 'Remove',
            }
          } else {
            // Show ADD button
            buttonConfig = {
              bg: 'su.orange',
              color: 'su.white',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              _hover: { bg: 'su.black' },
              onClick: (e) => {
                e.stopPropagation()
                onChoiceSelection(choice.id, entity.name)
              },
              children: 'Add',
            }
          }
        }

        return (
          <Suspense key={idx} fallback={<Box>Loading...</Box>}>
            <EntityDisplay
              hideActions
              data={entity}
              schemaName="actions"
              compact
              collapsible
              defaultExpanded={false}
              buttonConfig={buttonConfig}
            />
          </Suspense>
        )
      })}
    </VStack>
  )
}
