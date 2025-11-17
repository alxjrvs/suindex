/**
 * Test model metadata properties (schemaName and displayName)
 */

import { describe, expect, it } from 'vitest'
import { SalvageUnionReference, SchemaToDisplayName } from './index.js'

describe('Model Metadata', () => {
  describe('schemaName property', () => {
    it('should return correct schema name for Abilities', () => {
      expect(SalvageUnionReference.Abilities.schemaName).toBe('abilities')
    })

    it('should return correct schema name for Equipment', () => {
      expect(SalvageUnionReference.Equipment.schemaName).toBe('equipment')
    })

    it('should return correct schema name for Modules', () => {
      expect(SalvageUnionReference.Modules.schemaName).toBe('modules')
    })

    it('should return correct schema name for Chassis', () => {
      expect(SalvageUnionReference.Chassis.schemaName).toBe('chassis')
    })

    it('should return correct schema name for CoreClasses', () => {
      expect(SalvageUnionReference.CoreClasses.schemaName).toBe('classes.core')
    })

    it('should return correct schema name for AdvancedClasses', () => {
      expect(SalvageUnionReference.AdvancedClasses.schemaName).toBe('classes.advanced')
    })

    it('should return correct schema name for AbilityTreeRequirements', () => {
      expect(SalvageUnionReference.AbilityTreeRequirements.schemaName).toBe(
        'ability-tree-requirements'
      )
    })
  })

  describe('displayName property', () => {
    it('should return correct display name for Abilities', () => {
      expect(SalvageUnionReference.Abilities.displayName).toBe('Abilities')
    })

    it('should return correct display name for Equipment', () => {
      expect(SalvageUnionReference.Equipment.displayName).toBe('Equipment')
    })

    it('should return correct display name for Modules', () => {
      expect(SalvageUnionReference.Modules.displayName).toBe('Modules')
    })

    it('should return correct display name for Chassis', () => {
      expect(SalvageUnionReference.Chassis.displayName).toBe('Chassis')
    })

    it('should return correct display name for CoreClasses', () => {
      expect(SalvageUnionReference.CoreClasses.displayName).toBe('Core Classes')
    })

    it('should return correct display name for AdvancedClasses', () => {
      expect(SalvageUnionReference.AdvancedClasses.displayName).toBe('Advanced Classes')
    })

    it('should return correct display name for AbilityTreeRequirements', () => {
      expect(SalvageUnionReference.AbilityTreeRequirements.displayName).toBe(
        'Ability Tree Requirements'
      )
    })
  })

  describe('SchemaToDisplayName map', () => {
    it('should be exported', () => {
      expect(SchemaToDisplayName).toBeDefined()
    })

    it('should have correct mapping for abilities', () => {
      expect(SchemaToDisplayName.abilities).toBe('Abilities')
    })

    it('should have correct mapping for equipment', () => {
      expect(SchemaToDisplayName.equipment).toBe('Equipment')
    })

    it('should have correct mapping for modules', () => {
      expect(SchemaToDisplayName.modules).toBe('Modules')
    })

    it('should have correct mapping for chassis', () => {
      expect(SchemaToDisplayName.chassis).toBe('Chassis')
    })

    it('should have correct mapping for classes.core', () => {
      expect(SchemaToDisplayName['classes.core']).toBe('Core Classes')
    })

    it('should have correct mapping for classes.advanced', () => {
      expect(SchemaToDisplayName['classes.advanced']).toBe('Advanced Classes')
    })

    it('should have correct mapping for ability-tree-requirements', () => {
      expect(SchemaToDisplayName['ability-tree-requirements']).toBe('Ability Tree Requirements')
    })

    it('should have all schema names', () => {
      const expectedSchemas = [
        'abilities',
        'ability-tree-requirements',
        'bio-titans',
        'chassis',
        'classes.advanced',
        'classes.core',
        'crawler-bays',
        'crawler-tech-levels',
        'crawlers',
        'creatures',
        'drones',
        'equipment',
        'keywords',
        'meld',
        'modules',
        'npcs',
        'roll-tables',
        'squads',
        'systems',
        'traits',
        'vehicles',
      ]

      for (const schema of expectedSchemas) {
        expect(SchemaToDisplayName[schema as keyof typeof SchemaToDisplayName]).toBeDefined()
      }
    })
  })

  describe('Consistency between schemaName and SchemaToDisplayName', () => {
    it('should have matching schema names', () => {
      const schemaName = SalvageUnionReference.Abilities.schemaName
      const displayName = SalvageUnionReference.Abilities.displayName

      expect(SchemaToDisplayName[schemaName as keyof typeof SchemaToDisplayName]).toBe(displayName)
    })

    it('should work for all models', () => {
      const models = [
        SalvageUnionReference.Abilities,
        SalvageUnionReference.Equipment,
        SalvageUnionReference.Modules,
        SalvageUnionReference.Chassis,
        SalvageUnionReference.CoreClasses,
        SalvageUnionReference.AdvancedClasses,
        SalvageUnionReference.Systems,
        SalvageUnionReference.Drones,
        SalvageUnionReference.Vehicles,
      ]

      for (const model of models) {
        const schemaName = model.schemaName
        const displayName = model.displayName

        expect(SchemaToDisplayName[schemaName as keyof typeof SchemaToDisplayName]).toBe(
          displayName
        )
      }
    })
  })
})
