import { Button, VStack, Box } from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefObjectChoice, SURefEnumSchemaName, SURefEntity } from 'salvageunion-reference'
import { EntityDisplay } from '@/components/entity/EntityDisplay'
import { EntitySelectionModal } from '@/components/entity/EntitySelectionModal'
import { usePlayerChoices, getSelectionsForChoice } from '@/hooks/suentity'
import { Text } from '@/components/base/Text'

export function SheetEntityChoiceDisplay({
  choice,
  onUpdateChoice,
  entityId,
}: {
  choice: SURefObjectChoice
  onUpdateChoice?: (choiceId: string, value: string | undefined) => void
  entityId: string | undefined
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: playerChoices } = usePlayerChoices(entityId)
  const isMultiSelect = 'multiSelect' in choice && choice.multiSelect === true
  const hasChoiceOptions = 'choiceOptions' in choice && choice.choiceOptions

  const selectedValues = useMemo(() => {
    if (!playerChoices) return []
    return getSelectionsForChoice(playerChoices, choice.id)
  }, [playerChoices, choice.id])

  const selectedValue = useMemo(() => {
    if (isMultiSelect) return null // For multi-select, use selectedValues instead
    const playerChoice = playerChoices?.find((pc) => pc.choice_ref_id === choice.id)
    return playerChoice?.value || null
  }, [playerChoices, choice.id, isMultiSelect])

  const selectedEntity = useMemo(() => {
    if (!selectedValue) return null

    const entity = SalvageUnionReference.getByRef(selectedValue)
    if (!entity) return null

    const parsed = SalvageUnionReference.parseRef(selectedValue)
    if (!parsed) return null

    // EntityDisplay expects SURefEntity, but getByRef can return meta schemas
    // Since choices only reference entity schemas, this is safe
    return { entity: entity as SURefEntity, schemaName: parsed.schemaName.toLowerCase() }
  }, [selectedValue])

  const schemaNames = useMemo(() => {
    const { schema } = choice

    if (!schema) return []

    const pluralToSchemaName: Record<string, SURefEnumSchemaName> = {
      Systems: 'systems',
      Modules: 'modules',
      Abilities: 'abilities',
      Crawlers: 'crawlers',
      CrawlerBays: 'crawler-bays',
      Creatures: 'creatures',
      Drones: 'drones',
      Vehicles: 'vehicles',
      BioTitans: 'bio-titans',
      NPCs: 'npcs',
      Squads: 'squads',
      Keywords: 'keywords',
      Traits: 'traits',
      RollTables: 'roll-tables',
      CrawlerTechLevels: 'crawler-tech-levels',
    }

    return schema
      .map((schema) => {
        if (schema in pluralToSchemaName) {
          return pluralToSchemaName[schema as keyof typeof pluralToSchemaName]
        }

        return schema as SURefEnumSchemaName
      })
      .filter((name): name is SURefEnumSchemaName => name !== undefined)
  }, [choice])

  const handleSelect = (entityId: string, schemaName: SURefEnumSchemaName) => {
    const value = SalvageUnionReference.composeRef(schemaName, entityId)
    onUpdateChoice?.(choice.id, value)
    setIsModalOpen(false)
  }

  const handleSelectOption = (value: string) => {
    onUpdateChoice?.(choice.id, value)
  }

  const handleRemove = (valueToRemove?: string) => {
    if (isMultiSelect && valueToRemove) {
      // For multi-select, remove specific selection
      onUpdateChoice?.(choice.id, valueToRemove)
    } else {
      // For single-select, clear the choice
      onUpdateChoice?.(choice.id, undefined)
    }
  }

  const entityName =
    selectedEntity?.entity && 'name' in selectedEntity.entity
      ? selectedEntity.entity.name
      : choice.name

  // Handle choiceOptions (like Custom Sniper Rifle modifications)
  if (hasChoiceOptions && choice.choiceOptions) {
    const availableOptions = choice.choiceOptions

    return (
      <VStack gap={2} alignItems="stretch" mt={2}>
        {selectedValues.map((selection) => {
          const option = choice.choiceOptions!.find((opt) => opt.value === selection.value)
          if (!option) return null

          return (
            <Box key={selection.id} p={3} bg="su.lightBlue" borderRadius="md">
              <Text fontSize="md" fontWeight="bold" mb={option.description ? 1 : 0}>
                {option.label}
              </Text>
              {option.description && (
                <Text fontSize="sm" color="su.black" opacity={0.8} mb={2}>
                  {option.description}
                </Text>
              )}
              {onUpdateChoice && (
                <Button
                  bg="brand.srd"
                  color="su.white"
                  size="sm"
                  onClick={() => handleRemove(selection.value)}
                  mt={2}
                >
                  Remove
                </Button>
              )}
            </Box>
          )
        })}
        {onUpdateChoice && (
          <VStack gap={2} alignItems="stretch" mt={2}>
            {availableOptions
              .filter((opt) => {
                // For multi-select, show options that aren't already selected
                if (isMultiSelect) {
                  return !selectedValues.some((sv) => sv.value === opt.value)
                }
                // For single-select, show all if none selected
                return selectedValues.length === 0
              })
              .map((option) => (
                <Box
                  key={option.value}
                  p={3}
                  bg="su.white"
                  borderWidth="2px"
                  borderColor="su.black"
                  borderRadius="md"
                >
                  <Text fontSize="md" fontWeight="bold" mb={option.description ? 1 : 0}>
                    {option.label}
                  </Text>
                  {option.description && (
                    <Text fontSize="sm" color="su.black" opacity={0.8} mb={2}>
                      {option.description}
                    </Text>
                  )}
                  <Button
                    bg="su.orange"
                    color="su.white"
                    size="sm"
                    onClick={() => handleSelectOption(option.value)}
                    mt={2}
                  >
                    Add
                  </Button>
                </Box>
              ))}
          </VStack>
        )}
      </VStack>
    )
  }

  // Handle multi-select with entities
  if (isMultiSelect && selectedValues.length > 0) {
    return (
      <VStack gap={2} alignItems="stretch" mt={2}>
        {selectedValues.map((selection) => {
          const entity = SalvageUnionReference.getByRef(selection.value)
          if (!entity) return null

          const parsed = SalvageUnionReference.parseRef(selection.value)
          if (!parsed) return null

          const displayEntity = {
            entity: entity as SURefEntity,
            schemaName: parsed.schemaName.toLowerCase(),
          }
          const displayName =
            displayEntity.entity && 'name' in displayEntity.entity
              ? displayEntity.entity.name
              : choice.name

          return (
            <EntityDisplay
              key={selection.id}
              schemaName={displayEntity.schemaName as SURefEnumSchemaName}
              data={displayEntity.entity}
              compact
              collapsible
              defaultExpanded={false}
              buttonConfig={
                onUpdateChoice
                  ? {
                      bg: 'brand.srd',
                      color: 'su.white',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      _hover: { bg: 'su.black' },
                      onClick: (e) => {
                        e.stopPropagation()
                        const confirmed = window.confirm(
                          `Are you sure you want to remove "${displayName}"?`
                        )
                        if (confirmed) {
                          handleRemove(selection.value)
                        }
                      },
                      children: 'Remove',
                    }
                  : undefined
              }
            />
          )
        })}
        {onUpdateChoice && (
          <Button onClick={() => setIsModalOpen(true)} w="full">
            Add {choice.name}
          </Button>
        )}
        {onUpdateChoice && (
          <EntitySelectionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            schemaNames={schemaNames}
            onSelect={handleSelect}
            title={`Select ${choice.name}`}
          />
        )}
      </VStack>
    )
  }

  // Handle single-select (existing behavior)
  return (
    <>
      {!selectedEntity ? (
        onUpdateChoice && (
          <Button onClick={() => setIsModalOpen(true)} w="full" mt={2}>
            Select {choice.name}
          </Button>
        )
      ) : (
        <EntityDisplay
          schemaName={selectedEntity.schemaName as SURefEnumSchemaName}
          data={selectedEntity.entity}
          compact
          collapsible
          defaultExpanded={false}
          buttonConfig={
            onUpdateChoice
              ? {
                  bg: 'brand.srd',
                  color: 'su.white',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  _hover: { bg: 'su.black' },
                  onClick: (e) => {
                    e.stopPropagation()
                    const confirmed = window.confirm(
                      `Are you sure you want to remove "${entityName}"?`
                    )
                    if (confirmed) {
                      handleRemove()
                    }
                  },
                  children: `Remove ${choice.name}`,
                }
              : undefined
          }
        />
      )}

      {onUpdateChoice && (
        <EntitySelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          schemaNames={schemaNames}
          onSelect={handleSelect}
          title={`Select ${choice.name}`}
        />
      )}
    </>
  )
}
