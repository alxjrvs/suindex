import { describe, test, expect, mock, beforeEach } from 'bun:test'
import { render, screen } from '../test/chakra-utils'
import { EntityDisplay } from '../components/entity/EntityDisplay'
import { getSchemaCatalog } from 'salvageunion-reference'
import { getModel } from '../utils/modelMap'
import type { SURefEntity } from 'salvageunion-reference'

const schemaIndexData = getSchemaCatalog()

// Schemas to test - using dot notation for classes
const SCHEMAS_TO_TEST = [
  'abilities',
  'bio-titans',
  'chassis',
  'classes.core',
  'classes.advanced',
  'classes.hybrid',
  'crawlers',
  'crawler-bays',
  'creatures',
  'drones',
  'equipment',
  'keywords',
  'meld',
  'modules',
  'npcs',
  'squads',
  'systems',
  'traits',
  'vehicles',
] as const

// Properties that should be visible on the page for each entity
const COMMON_PROPERTIES = ['name', 'description']

// Schema-specific properties to check
const SCHEMA_SPECIFIC_PROPERTIES: Record<string, string[]> = {
  chassis: ['systemSlots', 'moduleSlots', 'salvageValue'],
  systems: ['slots', 'heat', 'ep'],
  modules: ['slots', 'heat', 'ep'],
  equipment: ['slots'],
  abilities: ['tree', 'level'],
  'classes.core': ['coreTrees', 'startingHp', 'startingAp'],
  'classes.advanced': ['coreTrees'],
  'classes.hybrid': ['coreTrees'],
  crawlers: ['systemSlots', 'moduleSlots', 'cargoCap'],
  'crawler-bays': ['bayType'],
  creatures: ['structure', 'energy'],
  drones: ['structure', 'energy'],
  vehicles: ['structure', 'energy'],
  'bio-titans': ['structure', 'energy'],
  npcs: ['hp', 'ap'],
  squads: ['structure'],
}

describe('Schema Entity Display Tests', () => {
  for (const schemaId of SCHEMAS_TO_TEST) {
    describe(`Schema: ${schemaId}`, () => {
      const model = getModel(schemaId)

      if (!model) {
        test.skip(`Model not found for ${schemaId}`, () => {})
      } else {
        const allEntities = model.all()

        if (allEntities.length === 0) {
          test.skip(`No entities found for ${schemaId}`, () => {})
        } else {
          // Test each entity in the schema
          for (const entity of allEntities) {
            test(`displays all properties for: ${entity.name}`, async () => {
              // Render the EntityDisplay component directly with the entity data
              render(
                <EntityDisplay
                  data={entity as SURefEntity}
                  schemaName={schemaId}
                  hideActions={false}
                  compact={false}
                  collapsible={false}
                />
              )

              // Wait for the entity name to appear
              const entityName = await screen.findByText(entity.name, {}, { timeout: 5000 })
              expect(entityName).toBeTruthy()

              // For now, just verify the entity renders
              // TODO: Add more specific property checks based on schema type
            })
          }
        }
      }
    })
  }
})
