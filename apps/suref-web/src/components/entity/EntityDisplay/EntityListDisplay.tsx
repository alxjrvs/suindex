import { VStack, Box, Button } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import type {
  SURefObjectChoice,
  SURefEnumSchemaName,
  SURefObjectSystemModule,
  SURefMetaEntity,
} from 'salvageunion-reference'
import type { ButtonProps } from '@chakra-ui/react'
import { getModel, extractActions, extractVisibleActions } from 'salvageunion-reference'
import { EntityDisplay } from './index'
import { NestedActionDisplay } from '../NestedActionDisplay'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export interface EntityListDisplayProps {
  choice: SURefObjectChoice
  selectedChoice?: string
  userChoices?: Record<string, string> | null
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
  isMultiSelect?: boolean
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
  isMultiSelect = false,
}: EntityListDisplayProps) {
  const { spacing } = useEntityDisplayContext()

  // Handle choiceOptions (structured options like Custom Sniper Rifle modifications)
  const choiceOptions =
    'choiceOptions' in choice && choice.choiceOptions ? choice.choiceOptions : []
  const hasChoiceOptions = choiceOptions.length > 0

  const entities = choice.schemaEntities
    ? choice.schemaEntities
        .map((entityName) => {
          const schema = choice.schema?.[0]
          if (!schema) return null

          const model = getModel(schema.toLowerCase())
          if (!model) return null

          return model.find((e) => e.name === entityName) ?? null
        })
        .filter((e): e is NonNullable<typeof e> => e !== null && e !== undefined)
    : choice.customSystemOptions || []

  // If we have choiceOptions, render them separately
  if (hasChoiceOptions) {
    const visibleOptions =
      selectedChoice && !isMultiSelect
        ? choiceOptions.filter((option) => option.value === selectedChoice)
        : choiceOptions

    if (visibleOptions.length === 0) return null

    return (
      <VStack gap={spacing.contentPadding} alignItems="start">
        {visibleOptions.map((option, idx) => {
          const isSelected = isMultiSelect
            ? userChoices?.[choice.id] === option.value
            : userChoices?.[choice.id] === option.value

          let buttonConfig: (ButtonProps & { children: React.ReactNode }) | undefined

          if (onChoiceSelection) {
            if (isSelected) {
              buttonConfig = {
                bg: 'su.brick',
                color: 'su.white',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                _hover: { bg: 'su.black' },
                onClick: (e) => {
                  e.stopPropagation()
                  // For multi-select, remove this specific selection
                  // For single-select, clear the choice
                  onChoiceSelection(choice.id, isMultiSelect ? option.value : undefined)
                },
                children: 'Remove',
              }
            } else {
              buttonConfig = {
                bg: 'su.orange',
                color: 'su.white',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                _hover: { bg: 'su.black' },
                onClick: (e) => {
                  e.stopPropagation()
                  onChoiceSelection(choice.id, option.value)
                },
                children: 'Add',
              }
            }
          }

          return (
            <Box key={idx} p={spacing.contentPadding} bg="su.lightBlue" borderRadius="md" w="full">
              <Text fontSize="md" fontWeight="bold" mb={option.description ? 2 : 0}>
                {option.label}
              </Text>
              {option.description && (
                <Text fontSize="sm" color="su.black" opacity={0.8} mb={2}>
                  {option.description}
                </Text>
              )}
              {buttonConfig && <Button {...buttonConfig} w="full" mt={2} />}
            </Box>
          )
        })}
      </VStack>
    )
  }

  // Otherwise, render entities as before
  const allEntities = entities

  const visibleEntities =
    selectedChoice && !isMultiSelect
      ? allEntities.filter((entity) => {
          const isSystemModule = 'actions' in entity && !('id' in entity)
          const entityName =
            'name' in entity
              ? entity.name
              : isSystemModule
                ? (() => {
                    const systemModule = entity as SURefObjectSystemModule
                    const resolvedActions = extractActions(systemModule as SURefMetaEntity)
                    return resolvedActions?.find((a) => !a.hidden)?.name
                  })()
                : (() => {
                    const visibleActions = extractVisibleActions(entity as SURefMetaEntity)
                    return visibleActions && visibleActions.length > 0
                      ? visibleActions[0].name
                      : undefined
                  })()
          return entityName === selectedChoice
        })
      : allEntities

  if (visibleEntities.length === 0) return null

  return (
    <VStack gap={spacing.contentPadding} alignItems="start">
      {visibleEntities.map((entity, idx) => {
        let buttonConfig: (ButtonProps & { children: React.ReactNode }) | undefined

        if (onChoiceSelection) {
          const entityName: string | undefined =
            'name' in entity
              ? (entity.name as string)
              : 'value' in entity
                ? (entity.value as string)
                : undefined

          // For multi-select, check if this specific value is selected
          // For single-select, check if any value is selected for this choice
          const isSelected = isMultiSelect
            ? entityName !== undefined && userChoices?.[choice.id] === entityName
            : userChoices?.[choice.id] !== undefined

          if (isSelected && !isMultiSelect) {
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
          } else if (isSelected && isMultiSelect && entityName) {
            // For multi-select, show remove button for selected items
            buttonConfig = {
              bg: 'su.brick',
              color: 'su.white',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              _hover: { bg: 'su.black' },
              onClick: (e) => {
                e.stopPropagation()
                onChoiceSelection(choice.id, entityName)
              },
              children: 'Remove',
            }
          } else {
            const isSystemModule = 'actions' in entity && !('id' in entity)
            const entityNameForSelection: string | undefined =
              'name' in entity
                ? (entity.name as string)
                : 'value' in entity
                  ? (entity.value as string)
                  : isSystemModule
                    ? (() => {
                        const systemModule = entity as SURefObjectSystemModule
                        const resolvedActions = extractActions(systemModule as SURefMetaEntity)
                        return resolvedActions?.find((a) => !a.hidden)?.name
                      })()
                    : (() => {
                        const visibleActions = extractVisibleActions(entity as SURefMetaEntity)
                        return visibleActions && visibleActions.length > 0
                          ? visibleActions[0].name
                          : undefined
                      })()
            if (entityNameForSelection) {
              buttonConfig = {
                bg: 'su.orange',
                color: 'su.white',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                _hover: { bg: 'su.black' },
                onClick: (e) => {
                  e.stopPropagation()
                  onChoiceSelection(choice.id, entityNameForSelection)
                },
                children: 'Add',
              }
            }
          }
        }

        const isSystemModule = 'actions' in entity && !('id' in entity)

        if (isSystemModule) {
          const systemModule = entity as SURefObjectSystemModule
          const resolvedActions = extractActions(systemModule as SURefMetaEntity)
          const visibleActions = resolvedActions?.filter((a) => !a.hidden)
          if (visibleActions && visibleActions.length > 0) {
            return <NestedActionDisplay key={idx} data={visibleActions[0]} compact />
          }
          return null
        }

        const schema = (choice.schema?.[0] || 'systems') as SURefEnumSchemaName
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
