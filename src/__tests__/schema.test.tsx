import { describe, test, expect } from 'bun:test'
import { render, waitFor } from '../test/render'
import { EntityDisplay } from '../components/entity/EntityDisplay'
import { getSchemaCatalog } from 'salvageunion-reference'
import { getModel } from '../utils/modelMap'
import type { SURefEntity, SURefSchemaName } from 'salvageunion-reference'
import { act } from '@testing-library/react'

const schemaCatalog = getSchemaCatalog()

const EXCLUDED_SCHEMAS = [
  'actions',
  'ability-tree-requirements',
  'crawler-tech-levels',
  'roll-tables',
]
const SCHEMAS_TO_TEST = schemaCatalog.schemas
  .map((schema) => schema.id)
  .filter((id) => !EXCLUDED_SCHEMAS.includes(id)) as SURefSchemaName[]

type PropertyCheckConfig = {
  /** Properties that should appear as numbers in the rendered output */
  numericProps?: string[]
  /** Properties that should appear as text (length > 1) in the rendered output */
  textProps?: string[]
}

const SCHEMA_PROPERTY_CHECKS: Record<string, PropertyCheckConfig> = {
  chassis: { numericProps: ['systemSlots', 'moduleSlots', 'salvageValue'] },
  systems: { numericProps: ['slotsRequired', 'heat', 'ep'] },
  modules: { numericProps: ['slotsRequired', 'heat', 'ep'] },
  equipment: { numericProps: ['slotsRequired'] },
  crawlers: { numericProps: ['systemSlots', 'moduleSlots', 'cargoCapacity'] },
  creatures: { numericProps: ['structurePoints', 'energyPoints'] },
  drones: { numericProps: ['structurePoints', 'energyPoints'] },
  vehicles: { numericProps: ['structurePoints'] },
  'bio-titans': { numericProps: ['structurePoints', 'energyPoints'] },
  npcs: { numericProps: ['hp', 'ap'] },
  squads: { numericProps: ['structurePoints'] },
  'classes.core': { numericProps: ['startingHp', 'startingAp'] },
}

/**
 * Helper function to verify entity properties are rendered
 */
function verifyEntityProperties(
  textContent: string,
  entity: SURefEntity,
  schemaId: SURefSchemaName
) {
  if ('description' in entity && entity.description) {
    const descriptionWithoutBrackets = entity.description
      .replace(/\[\[\[([^\]]+)\]\s*\(([^)]+)\)\]\]/g, '$1 ($2)')
      .replace(/\[\[([^\]]+)\]\]/g, '$1')
    expect(textContent).toContain(descriptionWithoutBrackets)
  }

  const propertyChecks = SCHEMA_PROPERTY_CHECKS[schemaId]
  if (!propertyChecks) return

  propertyChecks.numericProps?.forEach((prop) => {
    if (prop in entity) {
      const value = entity[prop as keyof typeof entity]
      if (typeof value === 'number') {
        expect(textContent).toContain(String(value))
      }
    }
  })

  propertyChecks.textProps?.forEach((prop) => {
    if (prop in entity) {
      const value = entity[prop as keyof typeof entity]
      if (typeof value === 'string' && value.length > 1) {
        expect(textContent).toContain(value)
      }
    }
  })
}

/**
 * Helper function to get all entities for a schema
 */
function getSchemaEntities(schemaId: SURefSchemaName): SURefEntity[] {
  const model = getModel(schemaId)
  return model?.all() || []
}

describe('Schema Entity Display Tests', () => {
  for (const schemaId of SCHEMAS_TO_TEST) {
    describe(`Schema: ${schemaId}`, () => {
      const allEntities = getSchemaEntities(schemaId)

      if (allEntities.length === 0) {
        test.skip(`No entities found for ${schemaId}`, () => {})
      }

      for (const entity of allEntities) {
        test(`displays all properties for: ${entity.name}`, async () => {
          let result: ReturnType<typeof render>
          await act(async () => {
            result = render(
              <EntityDisplay
                data={entity as SURefEntity}
                schemaName={schemaId}
                hideActions={false}
                compact={false}
                collapsible={false}
              />
            )
          })

          await waitFor(() => {
            const entityNameElements = result!.getAllByText(entity.name, { exact: false })
            expect(entityNameElements.length).toBeGreaterThan(0)
          })

          const textContent = result!.container.textContent || ''
          verifyEntityProperties(textContent, entity, schemaId)
        })
      }
    })
  }
})
