import { Button } from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import type { SURefSchemaName } from 'salvageunion-reference'
import { getModel } from '../../utils/modelMap'
import { EntityDisplay } from '../shared/EntityDisplay'
import { EntitySelectionModal } from '../shared/EntitySelectionModal'
import { SheetDisplay } from '../shared/SheetDisplay'

type CrawlerAbilityChoice = {
  id: string
  name: string
  description: string
  schema: string[]
}

export function SheetEntityChoiceDisplay({
  choice,
  onUpdateChoice,
  selectedValue,
}: {
  choice: CrawlerAbilityChoice
  onUpdateChoice: (choiceId: string, value: string | undefined) => void
  selectedValue: string | null
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Parse the selected value to get schema and entity ID
  const selectedEntity = useMemo(() => {
    if (!selectedValue) return null

    const [schemaName, entityId] = selectedValue.split('||')
    if (!schemaName || !entityId) return null

    const singularToPlural: Record<string, string> = {
      System: 'systems',
      Module: 'modules',
      Ability: 'abilities',
      Crawler: 'crawlers',
      CrawlerBay: 'crawler-bays',
      Creature: 'creatures',
      Drone: 'drones',
      Vehicle: 'vehicles',
      BioTitan: 'bio-titans',
      NPC: 'npcs',
      Squad: 'squads',
      Keyword: 'keywords',
      Trait: 'traits',
      RollTable: 'roll-tables',
      CrawlerTechLevel: 'crawler-tech-levels',
      Equipment: 'equipment',
      Chassis: 'chassis',
      Meld: 'meld',
    }

    const pluralSchemaName = singularToPlural[schemaName]

    const modelKey = pluralSchemaName || schemaName.toLowerCase()
    const model = getModel(modelKey)
    if (!model) return null

    const entity = model.find((e) => e.id === entityId)
    if (!entity) return null

    return { entity, schemaName: singularToPlural[schemaName] }
  }, [selectedValue])

  // Convert schema to schema names for the modal
  // Normalize plural schema names to kebab-case (e.g., "Systems" -> "systems")
  const schemaNames = useMemo(() => {
    const schemas = Array.isArray(choice.schema) ? choice.schema : [choice.schema]

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

    return schemas.map((schema) => {
      // If it's in the map, use the mapped value
      if (schema in pluralToSchemaName) {
        return pluralToSchemaName[schema as keyof typeof pluralToSchemaName]
      }
      // Otherwise assume it's already a schema name
      return schema as SURefSchemaName
    })
  }, [choice.schema])

  const handleSelect = (entityId: string, schemaName: SURefSchemaName) => {
    // THIS IS NOT BEING SET, ALEX. SCHEMA NAME IS BLANK FOR BAYS. FIGURE IT OUT SMART GUY!
    onUpdateChoice(choice.id, `${schemaName}||${entityId}`)
    setIsModalOpen(false)
  }

  const handleRemove = () => {
    onUpdateChoice(choice.id, undefined)
  }

  return (
    <>
      <SheetDisplay label={choice.name} value={choice.description}>
        {!selectedEntity ? (
          <Button onClick={() => setIsModalOpen(true)} w="full" mt={2}>
            Select {choice.name}
          </Button>
        ) : (
          <EntityDisplay
            schemaName={selectedEntity.schemaName as SURefSchemaName}
            onRemove={handleRemove}
            data={selectedEntity.entity}
            defaultExpanded={false}
          />
        )}
      </SheetDisplay>

      <EntitySelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        schemaNames={schemaNames}
        onSelect={handleSelect}
        title={`Select ${choice.name}`}
        showTechLevelFilter={true}
      />
    </>
  )
}
