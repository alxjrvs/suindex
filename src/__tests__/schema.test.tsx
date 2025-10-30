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
              const entityName = await screen.findByText(entity.name, {}, { timeout: 3000 })
              expect(entityName).toBeTruthy()

              // Check for common properties
              for (const prop of COMMON_PROPERTIES) {
                if (prop in entity && entity[prop as keyof typeof entity]) {
                  const value = entity[prop as keyof typeof entity]
                  if (typeof value === 'string' && value.length > 0 && value !== entity.name) {
                    // The value should be somewhere on the page
                    // Use getAllByText to handle multiple matches
                    const elements = screen.queryAllByText((content, element) => {
                      return (
                        content.includes(value) || element?.textContent?.includes(value) || false
                      )
                    })
                    expect(elements.length).toBeGreaterThan(0)
                  }
                }
              }

              // Check for schema-specific properties
              const specificProps = SCHEMA_SPECIFIC_PROPERTIES[schemaId] || []
              for (const prop of specificProps) {
                if (prop in entity) {
                  const value = entity[prop as keyof typeof entity]

                  // Handle different value types
                  if (typeof value === 'number') {
                    // Numbers should be visible as text
                    const elements = screen.queryAllByText((content, element) => {
                      return (
                        content.includes(value.toString()) ||
                        element?.textContent?.includes(value.toString()) ||
                        false
                      )
                    })
                    expect(elements.length).toBeGreaterThan(0)
                  } else if (typeof value === 'string' && value.length > 0) {
                    // Strings should be visible
                    const elements = screen.queryAllByText((content, element) => {
                      return (
                        content.includes(value) || element?.textContent?.includes(value) || false
                      )
                    })
                    expect(elements.length).toBeGreaterThan(0)
                  } else if (Array.isArray(value) && value.length > 0) {
                    // For arrays, check if at least one item is visible
                    const firstItem = value[0]
                    if (typeof firstItem === 'string') {
                      const elements = screen.queryAllByText((content, element) => {
                        return (
                          content.includes(firstItem) ||
                          element?.textContent?.includes(firstItem) ||
                          false
                        )
                      })
                      expect(elements.length).toBeGreaterThan(0)
                    }
                  }
                }
              }
            })
          }
        }
      }
    })
  }
})
