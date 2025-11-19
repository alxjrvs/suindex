import { describe, expect, test } from 'bun:test'
import { SalvageUnionReference } from './index.js'
import { getDataMaps } from './ModelFactory.js'
import {
  getDescription,
  getActivationCost,
  getActionType,
  getRange,
  getDamage,
  getTraits,
  getEffects,
  getTable,
  getOptions,
  getChoices,
  extractActions,
} from './utilities.js'

describe('Action Property Getters', () => {
  describe('getDescription', () => {
    test('should get description from ability', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      const description = getDescription(ability)
      expect(description).toBeDefined()
      expect(typeof description).toBe('string')
    })

    test('should return undefined for non-ability entities (deprecated)', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const description = getDescription(chassis)
      expect(description).toBeUndefined()
    })
  })

  describe('getActivationCost', () => {
    test('should get activation cost from ability (action property)', () => {
      const ability = SalvageUnionReference.Abilities.all().find((a) => a.name === 'Ace Pilot')
      if (ability) {
        const cost = getActivationCost(ability)
        expect(cost).toBeDefined()
      }
    })

    test('should extract from actions[0] when entity has exactly 1 action', () => {
      const { dataMap } = getDataMaps()
      const actionsData = dataMap['actions'] as Array<{
        id: string
        name: string
        activationCost?: number
      }>

      // Find an existing action with activationCost = 3
      const testAction = actionsData.find((a) => a.activationCost === 3)

      if (testAction && testAction.activationCost !== undefined) {
        const entity = {
          id: 'test-single-action',
          name: 'Test Single Action',
          actions: [testAction.name], // Use action name, not object
        }

        const cost = getActivationCost(entity as never)
        expect(cost).toBe(testAction.activationCost)
      }
    })

    test('should return undefined when entity has multiple actions', () => {
      const entity = {
        id: 'test-multi-action',
        name: 'Test Multi Action',
        actions: ['Action 1', 'Action 2'], // Use action names, not objects
      }

      const cost = getActivationCost(entity as never)
      expect(cost).toBeUndefined()
    })

    test('should prefer base-level property over actions[0]', () => {
      const { dataMap } = getDataMaps()
      const actionsData = dataMap['actions'] as Array<{ id: string; name: string }>
      const testAction = actionsData[0]

      if (testAction) {
        const entity = {
          id: 'test-base-level',
          name: 'Test Base Level',
          activationCost: 5,
          actions: [testAction.name], // Use action name, not object
        }

        const cost = getActivationCost(entity as never)
        expect(cost).toBe(5)
      }
    })

    test('should work correctly with real single-action systems', () => {
      const singleActionSystem = SalvageUnionReference.Systems.all().find(
        (s) => s.actions && s.actions.length === 1
      )
      if (singleActionSystem && singleActionSystem.actions) {
        const resolvedActions = extractActions(singleActionSystem)
        const cost = getActivationCost(singleActionSystem)
        if (resolvedActions && resolvedActions[0]?.activationCost) {
          expect(cost).toBe(resolvedActions[0].activationCost)
        }
      }
    })

    test('should return undefined for real multi-action chassis', () => {
      const multiActionChassis = SalvageUnionReference.Chassis.all().find(
        (c) =>
          c.chassisAbilities &&
          c.chassisAbilities.length > 1 &&
          c.chassisAbilities[0].activationCost !== undefined
      )
      if (multiActionChassis) {
        const cost = getActivationCost(multiActionChassis)
        expect(cost).toBeUndefined()
      }
    })
  })

  describe('getActionType', () => {
    test('should get action type from ability (action property)', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      const actionType = getActionType(ability)
      expect(actionType).toBeDefined()
      expect(typeof actionType).toBe('string')
    })

    test('should extract from actions[0] when entity has exactly 1 action', () => {
      const { dataMap } = getDataMaps()
      const actionsData = dataMap['actions'] as Array<{
        id: string
        name: string
        actionType?: string
      }>
      const testAction = actionsData.find((a) => a.actionType === 'Attack')

      if (testAction && testAction.actionType) {
        const entity = {
          id: 'test',
          name: 'Test',
          actions: [testAction.name], // Use action name, not object
        }
        expect(getActionType(entity as never)).toBe('Attack')
      }
    })

    test('should return undefined when entity has multiple actions', () => {
      const entity = {
        id: 'test',
        name: 'Test',
        actions: [
          { id: 'a1', name: 'A1', actionType: 'Attack' },
          { id: 'a2', name: 'A2', actionType: 'Utility' },
        ],
      }
      expect(getActionType(entity as never)).toBeUndefined()
    })
  })

  describe('getRange', () => {
    test('should get range from system (action property)', () => {
      const system = SalvageUnionReference.Systems.all().find((s) => s.name === 'Assault Rifle')
      if (system) {
        const range = getRange(system)
        expect(range).toBeDefined()
        expect(typeof range).toBe('string')
      }
    })

    test('should extract from actions[0] when entity has exactly 1 action', () => {
      const { dataMap } = getDataMaps()
      const actionsData = dataMap['actions'] as Array<{
        id: string
        name: string
        range?: string[]
      }>
      const testAction = actionsData.find((a) => a.range && a.range.length > 0)

      if (testAction && testAction.range) {
        const entity = {
          id: 'test',
          name: 'Test',
          actions: [testAction.name], // Use action name, not object
        }
        expect(getRange(entity as never)).toEqual(testAction.range)
      }
    })

    test('should return undefined when entity has multiple actions', () => {
      const entity = {
        id: 'test',
        name: 'Test',
        actions: [
          { id: 'a1', name: 'A1', range: ['6'] },
          { id: 'a2', name: 'A2', range: ['12'] },
        ],
      }
      expect(getRange(entity as never)).toBeUndefined()
    })
  })

  describe('getDamage', () => {
    test('should get damage from system (action property)', () => {
      const system = SalvageUnionReference.Systems.all().find((s) => s.name === 'Assault Rifle')
      if (system) {
        const damage = getDamage(system)
        expect(damage).toBeDefined()
        expect(damage).toHaveProperty('damageType')
        expect(damage).toHaveProperty('amount')
      }
    })

    test('should get damage from chassis action (base level)', () => {
      const chassis = SalvageUnionReference.Chassis.all().find(
        (c) => c.chassisAbilities && c.chassisAbilities.length > 0 && c.chassisAbilities[0].damage
      )
      if (chassis && chassis.chassisAbilities && chassis.chassisAbilities[0]) {
        const damage = getDamage(chassis)
        expect(damage).toBeDefined()
      }
    })

    test('should extract from actions[0] when entity has exactly 1 action', () => {
      const { dataMap } = getDataMaps()
      const actionsData = dataMap['actions'] as Array<{
        id: string
        name: string
        damage?: { damageType: string; amount: number }
      }>
      const testAction = actionsData.find((a) => a.damage)

      if (testAction && testAction.damage) {
        const entity = {
          id: 'test',
          name: 'Test',
          actions: [testAction.name], // Use action name, not object
        }
        expect(getDamage(entity as never)).toEqual(testAction.damage)
      }
    })

    test('should return undefined when entity has multiple actions', () => {
      const entity = {
        id: 'test',
        name: 'Test',
        actions: ['Action 1', 'Action 2'], // Use action names, not objects
      }
      expect(getDamage(entity as never)).toBeUndefined()
    })
  })

  describe('getTraits', () => {
    test('should get traits from system (action property)', () => {
      const system = SalvageUnionReference.Systems.all().find((s) => {
        const traits = getTraits(s)
        return traits && traits.length > 0
      })
      if (system) {
        const traits = getTraits(system)
        expect(traits).toBeDefined()
        expect(Array.isArray(traits)).toBe(true)
      }
    })

    test('should get traits from creature (base level)', () => {
      const creature = SalvageUnionReference.Creatures.all()[0]
      const traits = getTraits(creature)
      if (traits) {
        expect(Array.isArray(traits)).toBe(true)
      }
    })

    test('should extract from actions[0] when entity has exactly 1 action', () => {
      const { dataMap } = getDataMaps()
      const actionsData = dataMap['actions'] as Array<{
        id: string
        name: string
        traits?: Array<{ type: string; amount?: number }>
      }>
      const testAction = actionsData.find((a) => a.traits && a.traits.length > 0)

      if (testAction && testAction.traits) {
        const entity = {
          id: 'test',
          name: 'Test',
          actions: [testAction.name], // Use action name, not object
        }
        expect(getTraits(entity as never)).toEqual(testAction.traits)
      }
    })

    test('should return undefined when entity has multiple actions', () => {
      const entity = {
        id: 'test',
        name: 'Test',
        actions: ['Action 1', 'Action 2'], // Use action names, not objects
      }
      expect(getTraits(entity as never)).toBeUndefined()
    })
  })

  describe('getEffects', () => {
    test('should get effects from ability (base level)', () => {
      const ability = SalvageUnionReference.Abilities.all().find((a) => {
        const effects = getEffects(a)
        return effects && effects.length > 0
      })
      if (ability) {
        const effects = getEffects(ability)
        expect(effects).toBeDefined()
        expect(Array.isArray(effects)).toBe(true)
        if (effects && effects.length > 0) {
          expect(effects[0]).toHaveProperty('value')
        }
      }
    })

    test('should return undefined when entity has no effects', () => {
      const entity = {
        id: 'test',
        name: 'Test',
        actions: [{ id: 'a1', name: 'A1' }],
      }
      expect(getEffects(entity as never)).toBeUndefined()
    })
  })

  describe('getTable', () => {
    test('should get table from crawler bay (base level)', () => {
      const crawlerBay = SalvageUnionReference.CrawlerBays.all().find((cb) => {
        const table = getTable(cb)
        return table !== undefined
      })
      if (crawlerBay) {
        const table = getTable(crawlerBay)
        expect(table).toBeDefined()
        expect(table).toHaveProperty('type')
      }
    })
  })

  describe('getOptions', () => {
    test('should get options from ability (action property)', () => {
      const ability = SalvageUnionReference.Abilities.all().find((a) => {
        const options = getOptions(a)
        return options && options.length > 0
      })
      if (ability) {
        const options = getOptions(ability)
        expect(options).toBeDefined()
        expect(Array.isArray(options)).toBe(true)
      }
    })
  })

  describe('getChoices', () => {
    test('should get choices from equipment (action property)', () => {
      const equipment = SalvageUnionReference.Equipment.all().find((e) => {
        const choices = getChoices(e)
        return choices && choices.length > 0
      })
      if (equipment) {
        const choices = getChoices(equipment)
        expect(choices).toBeDefined()
        expect(Array.isArray(choices)).toBe(true)
      }
    })
  })
})
