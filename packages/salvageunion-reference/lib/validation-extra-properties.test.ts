/**
 * Test that unevaluatedProperties: false catches extra properties
 */

import { describe, expect, it, beforeAll } from 'vitest'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Ajv2019Import from 'ajv/dist/2019.js'
import addFormatsImport from 'ajv-formats'

const Ajv2019 = Ajv2019Import.default || Ajv2019Import
const addFormats = addFormatsImport.default || addFormatsImport

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface JSONSchemaObject {
  $id?: string
  [key: string]: unknown
}

// Create AJV instance with draft 2019-09 support
const ajv = new Ajv2019({
  strict: false,
  allErrors: true,
  verbose: true,
})
addFormats(ajv)

// Load shared schemas once before all tests
beforeAll(() => {
  const sharedSchemas = [
    {
      path: 'schemas/shared/common.schema.json',
      relativeId: 'shared/common.schema.json',
    },
    {
      path: 'schemas/shared/enums.schema.json',
      relativeId: 'shared/enums.schema.json',
    },
    {
      path: 'schemas/shared/objects.schema.json',
      relativeId: 'shared/objects.schema.json',
    },
  ]

  for (const sharedInfo of sharedSchemas) {
    const sharedPath = join(__dirname, '..', sharedInfo.path)
    const sharedSchema = JSON.parse(readFileSync(sharedPath, 'utf-8')) as JSONSchemaObject
    ajv.addSchema(sharedSchema, sharedInfo.relativeId)
  }
})

describe('Extra Properties Validation', () => {
  describe('Abilities', () => {
    let validate: ReturnType<typeof ajv.compile>

    beforeAll(() => {
      const schemaPath = join(__dirname, '../schemas/abilities.schema.json')
      const schema = JSON.parse(readFileSync(schemaPath, 'utf-8')) as JSONSchemaObject
      validate = ajv.compile(schema)
    })

    it('should reject abilities with extra properties', () => {
      const invalidData = [
        {
          id: 'test-id',
          name: 'Test Ability',
          source: 'Salvage Union Workshop Manual',
          page: 1,
          tree: 'Generic',
          level: 1,
          actions: ['Test Ability'], // Use action name, not object
          invalidProperty: 'This should not be allowed', // Extra property
        },
      ]

      const valid = validate(invalidData)

      expect(valid).toBe(false)
      expect(validate.errors).toBeDefined()
      expect(validate.errors?.length).toBeGreaterThan(0)
      expect(validate.errors?.[0]?.keyword).toBe('unevaluatedProperties')
    })

    it('should accept valid abilities without extra properties', () => {
      const validData = [
        {
          id: 'test-id',
          name: 'Test Ability',
          source: 'Salvage Union Workshop Manual',
          page: 1,
          tree: 'Generic',
          level: 1,
          actions: ['Test Ability'], // Use action name, not object
        },
      ]

      const valid = validate(validData)

      expect(valid).toBe(true)
    })
  })

  describe('Chassis', () => {
    let validate: ReturnType<typeof ajv.compile>

    beforeAll(() => {
      const schemaPath = join(__dirname, '../schemas/chassis.schema.json')
      const schema = JSON.parse(readFileSync(schemaPath, 'utf-8')) as JSONSchemaObject
      validate = ajv.compile(schema)
    })

    it('should reject chassis with extra properties', () => {
      const invalidData = [
        {
          id: 'test-id',
          name: 'Test Chassis',
          source: 'Salvage Union Workshop Manual',
          page: 1,
          description: 'Test description',
          structurePoints: 10,
          energyPoints: 10,
          heatCapacity: 10,
          systemSlots: 10,
          moduleSlots: 10,
          cargoCapacity: 10,
          techLevel: 1,
          salvageValue: 1,
          chassisAbilities: [],
          patterns: [],
          extraField: 'This should not be allowed', // Extra property
        },
      ]

      const valid = validate(invalidData)

      expect(valid).toBe(false)
      expect(validate.errors).toBeDefined()
      expect(validate.errors?.length).toBeGreaterThan(0)
      expect(validate.errors?.[0]?.keyword).toBe('unevaluatedProperties')
    })
  })

  describe('Equipment', () => {
    let validate: ReturnType<typeof ajv.compile>

    beforeAll(() => {
      const schemaPath = join(__dirname, '../schemas/equipment.schema.json')
      const schema = JSON.parse(readFileSync(schemaPath, 'utf-8')) as JSONSchemaObject
      validate = ajv.compile(schema)
    })

    it('should reject equipment with extra properties', () => {
      const invalidData = [
        {
          id: 'test-id',
          name: 'Test Equipment',
          source: 'Salvage Union Workshop Manual',
          page: 1,
          techLevel: 1,
          actions: ['Test Equipment'], // Use action name, not object
          unknownField: 'This should not be allowed', // Extra property
        },
      ]

      const valid = validate(invalidData)

      expect(valid).toBe(false)
      expect(validate.errors).toBeDefined()
      expect(validate.errors?.length).toBeGreaterThan(0)
      expect(validate.errors?.[0]?.keyword).toBe('unevaluatedProperties')
    })
  })
})
