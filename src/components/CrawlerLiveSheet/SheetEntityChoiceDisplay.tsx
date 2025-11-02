import { Button } from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefMetaChoice, SURefSchemaName } from 'salvageunion-reference'
import { EntityDisplay } from '../entity/EntityDisplay'
import { EntitySelectionModal } from '../entity/EntitySelectionModal'
import { usePlayerChoices } from '../../hooks/suentity'

export function SheetEntityChoiceDisplay({
  choice,
  onUpdateChoice,
  entityId,
}: {
  choice: SURefMetaChoice
  onUpdateChoice: (choiceId: string, value: string | undefined) => void
  entityId: string | undefined
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: playerChoices } = usePlayerChoices(entityId)

  // Get the selected value from player choices
  const selectedValue = useMemo(() => {
    const playerChoice = playerChoices?.find((pc) => pc.choice_ref_id === choice.id)
    return playerChoice?.value || null
  }, [playerChoices, choice.id])

  // Parse the selected value to get schema and entity ID
  const selectedEntity = useMemo(() => {
    if (!selectedValue) return null

    const entity = SalvageUnionReference.getByRef(selectedValue)
    if (!entity) return null

    // Extract schema name from the reference string
    const parsed = SalvageUnionReference.parseRef(selectedValue)
    if (!parsed) return null

    return { entity, schemaName: parsed.schemaName.toLowerCase() }
  }, [selectedValue])

  // Convert schema to schema names for the modal
  // Normalize plural schema names to kebab-case (e.g., "Systems" -> "systems")
  const schemaNames = useMemo(() => {
    const { schema } = choice

    if (!schema) return []
    // Map plural to kebab-case schema names
    const pluralToSchemaName: Record<string, SURefSchemaName> = {
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

    return schema.map((schema) => {
      // If it's in the map, use the mapped value
      if (schema in pluralToSchemaName) {
        return pluralToSchemaName[schema as keyof typeof pluralToSchemaName]
      }
      // Otherwise assume it's already a schema name
      return schema as SURefSchemaName
    })
  }, [choice])

  const handleSelect = (entityId: string, schemaName: SURefSchemaName) => {
    onUpdateChoice(choice.id, SalvageUnionReference.composeRef(schemaName, entityId))
    setIsModalOpen(false)
  }

  const handleRemove = () => {
    onUpdateChoice(choice.id, undefined)
  }

  const entityName =
    selectedEntity?.entity && 'name' in selectedEntity.entity
      ? selectedEntity.entity.name
      : choice.name

  return (
    <>
      {!selectedEntity ? (
        <Button onClick={() => setIsModalOpen(true)} w="full" mt={2}>
          Select {choice.name}
        </Button>
      ) : (
        <EntityDisplay
          schemaName={selectedEntity.schemaName as SURefSchemaName}
          data={selectedEntity.entity}
          compact
          collapsible
          defaultExpanded={false}
          buttonConfig={{
            bg: 'su.brick',
            color: 'su.white',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            _hover: { bg: 'su.black' },
            onClick: (e) => {
              e.stopPropagation()
              const confirmed = window.confirm(`Are you sure you want to remove "${entityName}"?`)
              if (confirmed) {
                handleRemove()
              }
            },
            children: `Remove ${choice.name}`,
          }}
        />
      )}

      <EntitySelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        schemaNames={schemaNames}
        onSelect={handleSelect}
        title={`Select ${choice.name}`}
      />
    </>
  )
}
