import { VStack } from '@chakra-ui/react'
import type { SURefMetaChoice, SURefSchemaName } from 'salvageunion-reference'
import type { ButtonProps } from '@chakra-ui/react'
import { getModel } from '../../../utils/modelMap'
import { EntityDisplay } from './index'
import { NestedActionDisplay } from '../NestedActionDisplay'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export interface EntityListDisplayProps {
  choice: SURefMetaChoice
  selectedChoice?: string
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
  userChoices,
  onChoiceSelection,
}: EntityListDisplayProps) {
  const { spacing } = useEntityDisplayContext()

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

  const visibleEntities = selectedChoice
    ? entities.filter((entity) => {
        const entityName = 'name' in entity ? entity.name : entity.action.name
        return entityName === selectedChoice
      })
    : entities

  if (visibleEntities.length === 0) return null

  return (
    <VStack gap={spacing.contentPadding} alignItems="start">
      {visibleEntities.map((entity, idx) => {
        let buttonConfig: (ButtonProps & { children: React.ReactNode }) | undefined

        if (onChoiceSelection) {
          const isSelected = userChoices?.[choice.id] !== undefined

          if (isSelected) {
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
            const entityName = 'name' in entity ? entity.name : entity.action.name
            buttonConfig = {
              bg: 'su.orange',
              color: 'su.white',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              _hover: { bg: 'su.black' },
              onClick: (e) => {
                e.stopPropagation()
                onChoiceSelection(choice.id, entityName)
              },
              children: 'Add',
            }
          }
        }

        const isSystemModule = 'action' in entity && !('id' in entity)

        if (isSystemModule) {
          return <NestedActionDisplay key={idx} data={entity.action} compact />
        }

        const schema = (choice.schema?.[0] || 'systems') as SURefSchemaName
        return (
          <EntityDisplay
            key={idx}
            hideActions
            data={entity}
            schemaName={schema}
            compact
            collapsible
            defaultExpanded={false}
            buttonConfig={buttonConfig}
          />
        )
      })}
    </VStack>
  )
}
