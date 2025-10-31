import { Button } from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefMetaChoice, SURefSchemaName } from 'salvageunion-reference'
import { getModel } from '../../utils/modelMap'
import { EntityDisplay } from '../entity/EntityDisplay'
import { EntitySelectionModal } from '../entity/EntitySelectionModal'

export function SheetEntityChoiceDisplay({
  choice,
  onUpdateChoice,
  selectedValue,
}: {
  choice: SURefMetaChoice
  onUpdateChoice: (choiceId: string, value: string | undefined) => void
  selectedValue: string | null
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Parse the selected value to get schema and entity ID
  const selectedEntity = useMemo(() => {
    if (!selectedValue) return null

    const parsed = SalvageUnionReference.parseRef(selectedValue)
    if (!parsed) return null

    const { schemaName, id: entityId } = parsed
    const normalizedSchemaName = schemaName.toLowerCase()

    const model = getModel(normalizedSchemaName)
    if (!model) return null

    const entity = model.find((e) => e.id === entityId)
    if (!entity) return null

    return { entity, schemaName: normalizedSchemaName }
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
