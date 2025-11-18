/**
 * Utility functions for Salvage Union entities
 * Manually defined type guards and property extractors
 */

import type { SURefMetaEntity, SURefMetaAction, SURefMetaGrant } from './types/index.js'
import type {
  SURefAbility,
  SURefAdvancedClass,
  SURefChassis,
  SURefCoreClass,
  SURefModule,
  SURefSystem,
} from './types/index.js'
import { getDataMaps } from './ModelFactory.js'

// ============================================================================
// TYPE UTILITIES
// ============================================================================

/**
 * Get all possible keys from a union type
 */
type AllKeys<T> = T extends unknown ? keyof T : never

/**
 * All possible property keys across all SURefMetaEntity types
 */
type SURefMetaEntityKeys = AllKeys<SURefMetaEntity>

/**
 * Get the type of a property across all types in the union
 * Returns the union of all possible types for that property
 */
type PropertyType<T, K extends PropertyKey> = T extends unknown
  ? K extends keyof T
    ? T[K]
    : never
  : never

// ============================================================================
// PROPERTY EXTRACTORS
// ============================================================================

/**
 * Type-safe property extractor for SURefMetaEntity
 * @param entity - The entity to extract from
 * @param propertyName - The property name to extract
 * @returns The property value or undefined if not present
 */
export function extractProperty<K extends SURefMetaEntityKeys>(
  entity: SURefMetaEntity,
  propertyName: K
): PropertyType<SURefMetaEntity, K> | undefined {
  if (entity !== null && typeof entity === 'object' && propertyName in entity) {
    return (entity as unknown as Record<string, unknown>)[propertyName as string] as PropertyType<
      SURefMetaEntity,
      K
    >
  }
  return undefined
}

/**
 * Extract tech level from an entity
 * @param entity - The entity to extract from
 * @returns The tech level or undefined
 */
export function getTechLevel(entity: SURefMetaEntity): number | undefined {
  return 'techLevel' in entity && typeof entity.techLevel === 'number'
    ? entity.techLevel
    : undefined
}

/**
 * Extract salvage value from an entity
 * @param entity - The entity to extract from
 * @returns The salvage value or undefined
 */
export function getSalvageValue(entity: SURefMetaEntity): number | undefined {
  return 'salvageValue' in entity && typeof entity.salvageValue === 'number'
    ? entity.salvageValue
    : undefined
}

/**
 * Extract slots required from an entity
 * @param entity - The entity to extract from
 * @returns The slots required or undefined
 */
export function getSlotsRequired(entity: SURefMetaEntity): number | undefined {
  return 'slotsRequired' in entity && typeof entity.slotsRequired === 'number'
    ? entity.slotsRequired
    : undefined
}

/**
 * Extract required slots from an entity (alias for getSlotsRequired)
 * @param entity - The entity to extract from
 * @returns The required slots or undefined
 */
export function getRequiredSlots(entity: SURefMetaEntity): number | undefined {
  return getSlotsRequired(entity)
}

/**
 * Extract page reference from an entity
 * @param entity - The entity to extract from
 * @returns The page number or undefined
 */
export function getPageReference(entity: SURefMetaEntity): number | undefined {
  return 'page' in entity && typeof entity.page === 'number' ? entity.page : undefined
}

/**
 * Extract actions from an entity
 * Resolves action names to full action objects from actions schema
 * @param entity - The entity to extract from
 * @returns The actions array or undefined
 */
export function extractActions(entity: SURefMetaEntity): SURefMetaAction[] | undefined {
  if (!('actions' in entity) || !Array.isArray(entity.actions)) {
    return undefined
  }

  const actionNames = entity.actions as string[]

  // Resolve each action name to its full action object from actions schema
  const { dataMap } = getDataMaps()
  const actionsData = dataMap['actions'] as SURefMetaAction[] | undefined

  if (!actionsData) {
    console.warn('actions schema not found')
    return undefined
  }

  // Create a map of action name to action object
  const actionMap = new Map<string, SURefMetaAction>()
  actionsData.forEach((action) => {
    actionMap.set(action.name, action)
  })

  // Resolve each action name to its object
  const resolved: SURefMetaAction[] = []
  for (const actionName of actionNames) {
    if (typeof actionName !== 'string') {
      console.warn(`Invalid action: expected string, got ${typeof actionName}`)
      continue
    }
    const action = actionMap.get(actionName)
    if (action) {
      resolved.push(action)
    } else {
      console.warn(`Action "${actionName}" not found in actions schema`)
    }
  }

  return resolved.length > 0 ? resolved : undefined
}

/**
 * Extract visible (non-hidden) actions from an entity
 * @param entity - The entity to extract from
 * @returns The visible actions array or undefined
 */
export function extractVisibleActions(entity: SURefMetaEntity): SURefMetaAction[] | undefined {
  const actions = extractActions(entity)
  if (!actions) return undefined
  return actions.filter((action) => !action.hidden)
}

/**
 * Extract chassis abilities from a chassis
 * Resolves ability names to full ability objects from chassis-abilities schema
 * @param entity - The entity to extract from
 * @returns The chassis abilities array or undefined
 */
export function getChassisAbilities(entity: SURefMetaEntity): SURefMetaAction[] | undefined {
  if (!('chassisAbilities' in entity) || !Array.isArray(entity.chassisAbilities)) {
    return undefined
  }

  const chassisAbilities = entity.chassisAbilities

  // Chassis abilities are now stored as an array of ability names (strings)
  // Resolve each name to its full ability object from the chassis-abilities schema
  const { dataMap } = getDataMaps()
  const chassisAbilitiesData = dataMap['chassis-abilities'] as SURefMetaAction[] | undefined

  if (!chassisAbilitiesData) {
    console.warn('chassis-abilities schema not found')
    return undefined
  }

  // Create a map of ability name to ability object
  const abilityMap = new Map<string, SURefMetaAction>()
  chassisAbilitiesData.forEach((ability) => {
    abilityMap.set(ability.name, ability)
  })

  // Resolve each ability name to its object
  const resolved: SURefMetaAction[] = []
  for (const abilityName of chassisAbilities) {
    if (typeof abilityName !== 'string') {
      console.warn(`Invalid chassis ability: expected string, got ${typeof abilityName}`)
      continue
    }
    const ability = abilityMap.get(abilityName)
    if (ability) {
      resolved.push(ability)
    } else {
      console.warn(`Chassis ability "${abilityName}" not found in chassis-abilities schema`)
    }
  }

  return resolved.length > 0 ? resolved : undefined
}

/**
 * Extract structure points from an entity
 * @param entity - The entity to extract from
 * @returns The structure points or undefined
 */
export function getStructurePoints(entity: SURefMetaEntity): number | undefined {
  return 'structurePoints' in entity && typeof entity.structurePoints === 'number'
    ? entity.structurePoints
    : undefined
}

/**
 * Extract energy points from an entity
 * @param entity - The entity to extract from
 * @returns The energy points or undefined
 */
export function getEnergyPoints(entity: SURefMetaEntity): number | undefined {
  return 'energyPoints' in entity && typeof entity.energyPoints === 'number'
    ? entity.energyPoints
    : undefined
}

/**
 * Extract heat capacity from an entity
 * @param entity - The entity to extract from
 * @returns The heat capacity or undefined
 */
export function getHeatCapacity(entity: SURefMetaEntity): number | undefined {
  return 'heatCapacity' in entity && typeof entity.heatCapacity === 'number'
    ? entity.heatCapacity
    : undefined
}

/**
 * Extract system slots from an entity
 * @param entity - The entity to extract from
 * @returns The number of system slots or undefined
 */
export function getSystemSlots(entity: SURefMetaEntity): number | undefined {
  return 'systemSlots' in entity && typeof entity.systemSlots === 'number'
    ? entity.systemSlots
    : undefined
}

/**
 * Extract module slots from an entity
 * @param entity - The entity to extract from
 * @returns The number of module slots or undefined
 */
export function getModuleSlots(entity: SURefMetaEntity): number | undefined {
  return 'moduleSlots' in entity && typeof entity.moduleSlots === 'number'
    ? entity.moduleSlots
    : undefined
}

/**
 * Extract cargo capacity from an entity
 * @param entity - The entity to extract from
 * @returns The cargo capacity or undefined
 */
export function getCargoCapacity(entity: SURefMetaEntity): number | undefined {
  return 'cargoCapacity' in entity && typeof entity.cargoCapacity === 'number'
    ? entity.cargoCapacity
    : undefined
}

/**
 * Extract hit points from an entity
 * Used for NPCs, Creatures, Squads, and Meld
 * @param entity - The entity to extract from
 * @returns The hit points or undefined
 */
export function getHitPoints(entity: SURefMetaEntity): number | undefined {
  return 'hitPoints' in entity && typeof entity.hitPoints === 'number'
    ? entity.hitPoints
    : undefined
}

/**
 * Extract asset URL from an entity
 * @param entity - The entity to extract from
 * @returns The asset URL or undefined
 */
export function getAssetUrl(entity: SURefMetaEntity): string | undefined {
  return 'asset_url' in entity && typeof entity.asset_url === 'string'
    ? entity.asset_url
    : undefined
}

/**
 * Extract blackMarket flag from an entity
 * @param entity - The entity to extract from
 * @returns True if the entity is from the Black Market, false if not, undefined if not present
 */
export function getBlackMarket(entity: SURefMetaEntity): boolean | undefined {
  return 'blackMarket' in entity && typeof entity.blackMarket === 'boolean'
    ? entity.blackMarket
    : undefined
}

// ============================================================================
// TYPE GUARDS - Property-based
// ============================================================================

/**
 * Type guard to check if an entity has a techLevel property
 * @param entity - The entity to check
 * @returns True if the entity has a techLevel property
 */
export function hasTechLevel(
  entity: SURefMetaEntity
): entity is SURefMetaEntity & { techLevel: number } {
  return 'techLevel' in entity && typeof entity.techLevel === 'number'
}

/**
 * Type guard to check if an entity has a salvageValue property
 * @param entity - The entity to check
 * @returns True if the entity has a salvageValue property
 */
export function hasSalvageValue(
  entity: SURefMetaEntity
): entity is SURefMetaEntity & { salvageValue: number } {
  return 'salvageValue' in entity && typeof entity.salvageValue === 'number'
}

/**
 * Type guard to check if an entity has a slotsRequired property
 * @param entity - The entity to check
 * @returns True if the entity has a slotsRequired property
 */
export function hasSlotsRequired(
  entity: SURefMetaEntity
): entity is SURefMetaEntity & { slotsRequired: number } {
  return 'slotsRequired' in entity && typeof entity.slotsRequired === 'number'
}

/**
 * Type guard to check if an entity has actions
 * @param entity - The entity to check
 * @returns True if the entity has an actions array
 */
export function hasActions(
  entity: SURefMetaEntity
): entity is SURefMetaEntity & { actions: string[] } {
  return 'actions' in entity && Array.isArray(entity.actions)
}

/**
 * Type guard to check if an entity has traits
 * @param entity - The entity to check
 * @returns True if the entity has a traits property (either at base level or in action property)
 */
export function hasTraits(
  entity: SURefMetaEntity
): entity is SURefMetaEntity & { traits?: unknown[] } {
  // Check if traits exists at base level
  const hasBaseTraits =
    'traits' in entity && (entity.traits === undefined || Array.isArray(entity.traits))

  // Check if traits exists in actions[0] property
  // Check resolved actions[0] property (actions are now strings, need to resolve)
  const resolvedActions = extractActions(entity)
  const hasActionTraits = Boolean(
    resolvedActions &&
    resolvedActions.length > 0 &&
    resolvedActions[0] !== null &&
    typeof resolvedActions[0] === 'object' &&
    'traits' in resolvedActions[0] &&
    (resolvedActions[0].traits === undefined || Array.isArray(resolvedActions[0].traits))
  )

  return hasBaseTraits || hasActionTraits
}

// ============================================================================
// TYPE GUARDS - Schema-specific
// ============================================================================

/**
 * Type guard to check if an entity is an Ability
 * @param entity - The entity to check
 * @returns True if the entity is an Ability
 */
export function isAbility(entity: SURefMetaEntity): entity is SURefAbility {
  return entity !== null && typeof entity === 'object' && 'tree' in entity && 'level' in entity
}

/**
 * Type guard to check if an entity is a System
 * Note: Systems and Modules share the same schema, so this checks for
 * the presence of required system/module properties
 * @param entity - The entity to check
 * @returns True if the entity is a System
 */
export function isSystem(entity: SURefMetaEntity): entity is SURefSystem {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'techLevel' in entity &&
    'salvageValue' in entity &&
    'slotsRequired' in entity &&
    'actions' in entity
  )
}

/**
 * Type guard to check if an entity is a Module
 * Note: Systems and Modules share the same schema, so this checks for
 * the presence of required system/module properties
 * @param entity - The entity to check
 * @returns True if the entity is a Module
 */
export function isModule(entity: SURefMetaEntity): entity is SURefModule {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'techLevel' in entity &&
    'salvageValue' in entity &&
    'slotsRequired' in entity &&
    'actions' in entity
  )
}

/**
 * Type guard to check if an entity is a Chassis
 * @param entity - The entity to check
 * @returns True if the entity is a Chassis
 */
export function isChassis(entity: SURefMetaEntity): entity is SURefChassis {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'patterns' in entity &&
    'structurePoints' in entity &&
    'energyPoints' in entity &&
    'heatCapacity' in entity
  )
}

/**
 * Type guard to check if an entity is a Core Class
 * @param entity - The entity to check
 * @returns True if the entity is a Core Class
 */
export function isCoreClass(entity: SURefMetaEntity): entity is SURefCoreClass {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'maxAbilities' in entity &&
    'coreTrees' in entity &&
    'advanceable' in entity
  )
}

/**
 * Type guard to check if an entity is an Advanced Class
 * @param entity - The entity to check
 * @returns True if the entity is an Advanced Class
 */
export function isBaseAdvancedClass(entity: SURefMetaEntity): entity is SURefAdvancedClass {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'advancedTree' in entity &&
    !('hybridTree' in entity)
  )
}

/**
 * Type guard to check if an entity is an Advanced Class
 * @param entity - The entity to check
 * @returns True if the entity is an Advanced Class
 */
export function isAdvancedClass(entity: SURefMetaEntity): entity is SURefAdvancedClass {
  return isBaseAdvancedClass(entity) && entity.type === 'Advanced'
}

/**
 * Type guard to check if an entity is a Hybrid Class
 * @param entity - The entity to check
 * @returns True if the entity is a Hybrid Class
 */
export function isHybridClass(entity: SURefMetaEntity): entity is SURefAdvancedClass {
  return isBaseAdvancedClass(entity) && entity.type === 'Hybrid'
}

/**
 * Type guard to check if an entity is a class (any type)
 * @param entity - The entity to check
 * @returns True if the entity is a Core, Advanced, or Hybrid class
 */
export function isClass(entity: SURefMetaEntity): entity is SURefCoreClass | SURefAdvancedClass {
  return isCoreClass(entity) || isAdvancedClass(entity) || isHybridClass(entity)
}

/**
 * Type guard to check if an entity is a System or Module
 * @param entity - The entity to check
 * @returns True if the entity is a System or Module
 */
export function isSystemOrModule(entity: SURefMetaEntity): entity is SURefSystem | SURefModule {
  return isSystem(entity) || isModule(entity)
}

// ============================================================================
// ACTION PROPERTY GETTERS
// ============================================================================

/**
 * Get description from an entity
 * @param entity - The entity to extract description from
 * @returns The description or undefined if not an ability
 */
export function getDescription(entity: SURefMetaEntity): string | undefined {
  // Only return description for abilities
  if ('description' in entity && typeof entity.description === 'string') {
    return entity.description
  }

  return undefined
}

/**
 * Get activation cost from an entity
 * Checks base level first, then actions[0] if entity has exactly 1 visible action
 * @param entity - The entity to extract activation cost from
 * @returns The activation cost or undefined if not present
 */
export function getActivationCost(entity: SURefMetaEntity): number | string | undefined {
  // Check base level first
  if (
    'activationCost' in entity &&
    (typeof entity.activationCost === 'number' || typeof entity.activationCost === 'string')
  ) {
    return entity.activationCost
  }

  // Check actions[0] property (only if entity has exactly 1 visible action)
  const visibleActions = extractVisibleActions(entity)
  if (
    visibleActions &&
    visibleActions.length === 1 &&
    visibleActions[0] !== null &&
    typeof visibleActions[0] === 'object' &&
    'activationCost' in visibleActions[0] &&
    (typeof visibleActions[0].activationCost === 'number' ||
      typeof visibleActions[0].activationCost === 'string')
  ) {
    return visibleActions[0].activationCost
  }

  return undefined
}

/**
 * Get action type from an entity
 * Checks base level first, then actions[0] if entity has exactly 1 visible action
 * @param entity - The entity to extract action type from
 * @returns The action type or undefined if not present
 */
export function getActionType(entity: SURefMetaEntity): string | undefined {
  // Check base level first
  if ('actionType' in entity && typeof entity.actionType === 'string') {
    return entity.actionType
  }

  // Check actions[0] property (only if entity has exactly 1 visible action)
  const visibleActions = extractVisibleActions(entity)
  if (
    visibleActions &&
    visibleActions.length === 1 &&
    visibleActions[0] !== null &&
    typeof visibleActions[0] === 'object' &&
    'actionType' in visibleActions[0] &&
    typeof visibleActions[0].actionType === 'string'
  ) {
    return visibleActions[0].actionType
  }

  return undefined
}

/**
 * Get range from an entity
 * Checks base level first, then actions[0] if entity has exactly 1 visible action
 * @param entity - The entity to extract range from
 * @returns The range array or undefined if not present
 */
export function getRange(entity: SURefMetaEntity): string[] | undefined {
  // Check base level first
  if ('range' in entity && Array.isArray(entity.range)) {
    return entity.range
  }

  // Check actions[0] property (only if entity has exactly 1 visible action)
  const visibleActions = extractVisibleActions(entity)
  if (
    visibleActions &&
    visibleActions.length === 1 &&
    visibleActions[0] !== null &&
    typeof visibleActions[0] === 'object' &&
    'range' in visibleActions[0] &&
    Array.isArray(visibleActions[0].range)
  ) {
    return visibleActions[0].range
  }

  return undefined
}

/**
 * Get damage from an entity
 * Checks base level first, then actions[0] if entity has exactly 1 visible action
 * @param entity - The entity to extract damage from
 * @returns The damage object or undefined if not present
 */
export function getDamage(entity: SURefMetaEntity):
  | {
      damageType: string
      amount: number | string
    }
  | undefined {
  // Check base level first
  if ('damage' in entity && entity.damage !== null && typeof entity.damage === 'object') {
    return entity.damage as { damageType: string; amount: number | string }
  }

  // Check actions[0] property (only if entity has exactly 1 visible action)
  const visibleActions = extractVisibleActions(entity)
  if (
    visibleActions &&
    visibleActions.length === 1 &&
    visibleActions[0] !== null &&
    typeof visibleActions[0] === 'object' &&
    'damage' in visibleActions[0] &&
    visibleActions[0].damage !== null &&
    typeof visibleActions[0].damage === 'object'
  ) {
    return visibleActions[0].damage as {
      damageType: string
      amount: number | string
    }
  }

  return undefined
}

/**
 * Get traits from an entity
 * Checks base level first, then actions[0] if entity has exactly 1 visible action
 * @param entity - The entity to extract traits from
 * @returns The traits array or undefined if not present
 */
export function getTraits(entity: SURefMetaEntity):
  | Array<{
      amount?: number | string
      type: string
    }>
  | undefined {
  // Check base level first
  if ('traits' in entity && Array.isArray(entity.traits)) {
    return entity.traits as Array<{ amount?: number | string; type: string }>
  }

  // Check actions[0] property (only if entity has exactly 1 visible action)
  const visibleActions = extractVisibleActions(entity)
  if (
    visibleActions &&
    visibleActions.length === 1 &&
    visibleActions[0] !== null &&
    typeof visibleActions[0] === 'object' &&
    'traits' in visibleActions[0] &&
    Array.isArray(visibleActions[0].traits)
  ) {
    return visibleActions[0].traits as Array<{
      amount?: number | string
      type: string
    }>
  }

  return undefined
}

/**
 * Get effects from an entity
 * Note: Effects only exist at base level, not in actions
 * @param entity - The entity to extract effects from
 * @returns The effects array or undefined if not present
 */
export function getEffects(entity: SURefMetaEntity):
  | Array<{
      label?: string
      value: string
    }>
  | undefined {
  // Check base level only (effects don't exist in actions)
  if ('effects' in entity && Array.isArray(entity.effects)) {
    return entity.effects as Array<{ label?: string; value: string }>
  }

  return undefined
}

/**
 * Get table from an entity
 * Checks both base level and nested action property
 * @param entity - The entity to extract table from
 * @returns The table object or undefined if not present
 */
export function getTable(entity: SURefMetaEntity):
  | {
      type: 'standard' | 'alternate' | 'flat' | 'full'
      [key: string]: string
    }
  | undefined {
  // Check base level first
  if ('table' in entity && entity.table !== null && typeof entity.table === 'object') {
    return entity.table as {
      type: 'standard' | 'alternate' | 'flat' | 'full'
      [key: string]: string
    }
  }

  // Check resolved actions[0] property (actions are now strings, need to resolve)
  const resolvedActions = extractActions(entity)
  if (
    resolvedActions &&
    resolvedActions.length > 0 &&
    resolvedActions[0] !== null &&
    typeof resolvedActions[0] === 'object' &&
    'table' in resolvedActions[0] &&
    resolvedActions[0].table !== null &&
    typeof resolvedActions[0].table === 'object'
  ) {
    return resolvedActions[0].table as {
      type: 'standard' | 'alternate' | 'flat' | 'full'
      [key: string]: string
    }
  }

  return undefined
}

/**
 * Get options from an entity
 * Checks both base level and nested action property
 * @param entity - The entity to extract options from
 * @returns The options array or undefined if not present
 */
export function getOptions(entity: SURefMetaEntity):
  | Array<{
      label: string
      value: string
    }>
  | undefined {
  // Check base level first
  if ('options' in entity && Array.isArray(entity.options)) {
    return entity.options as Array<{ label: string; value: string }>
  }

  // Check resolved actions[0] property (actions are now strings, need to resolve)
  const resolvedActions = extractActions(entity)
  if (
    resolvedActions &&
    resolvedActions.length > 0 &&
    resolvedActions[0] !== null &&
    typeof resolvedActions[0] === 'object' &&
    'options' in resolvedActions[0] &&
    Array.isArray(resolvedActions[0].options)
  ) {
    return resolvedActions[0].options as Array<{ label: string; value: string }>
  }

  return undefined
}

/**
 * Get choices from an entity
 * Checks single action choices first (if entity has exactly 1 visible action), then root-level choices
 * @param entity - The entity to extract choices from
 * @returns The choices array or undefined if not present
 */
export function getChoices(entity: SURefMetaEntity):
  | Array<{
      id: string
      name: string
      description?: string
      [key: string]: unknown
    }>
  | undefined {
  // Check if entity has a single visible action with choices - use those first
  const visibleActions = extractVisibleActions(entity)
  if (
    visibleActions &&
    visibleActions.length === 1 &&
    visibleActions[0] !== null &&
    typeof visibleActions[0] === 'object' &&
    'choices' in visibleActions[0] &&
    Array.isArray(visibleActions[0].choices)
  ) {
    return visibleActions[0].choices as Array<{
      id: string
      name: string
      description?: string
      [key: string]: unknown
    }>
  }

  // Fall back to root-level choices
  if ('choices' in entity && Array.isArray(entity.choices)) {
    return entity.choices as Array<{
      id: string
      name: string
      description?: string
      [key: string]: unknown
    }>
  }

  return undefined
}

/**
 * Get grants from an entity
 * @param entity - The entity to extract grants from
 * @returns The grants array or undefined if not present
 */
export function getGrants(entity: SURefMetaEntity): SURefMetaGrant[] | undefined {
  if ('grants' in entity && Array.isArray(entity.grants)) {
    return entity.grants as SURefMetaGrant[]
  }

  return undefined
}

/**
 * Represents a parsed trait reference from text
 */
export interface ParsedTraitReference {
  /** The full matched text including brackets */
  fullMatch: string
  /** The trait name (e.g., "Hot", "Burn", "Explosive") */
  traitName: string
  /** The parameter if present (e.g., "3", "X", "2") */
  parameter?: string
  /** The start index of the match in the original text */
  startIndex: number
  /** The end index of the match in the original text */
  endIndex: number
}

/**
 * Parse trait references from text
 * Handles both simple [[TraitName]] and parameterized [[[TraitName] (param)]] formats
 * @param text - The text to parse for trait references
 * @returns Array of parsed trait references
 *
 * @example
 * const text = "This has the [[Shield]] Trait and [[[Hot] (3)]] Trait"
 * const refs = parseTraitReferences(text)
 * // => [
 * //   { fullMatch: "[[Shield]]", traitName: "Shield", startIndex: 13, endIndex: 23 },
 * //   { fullMatch: "[[[Hot] (3)]]", traitName: "Hot", parameter: "3", startIndex: 35, endIndex: 48 }
 * // ]
 */
export function parseTraitReferences(text: string): ParsedTraitReference[] {
  const references: ParsedTraitReference[] = []

  // Pattern for parameterized traits: [[[TraitName] (param)]]
  const paramPattern = /\[\[\[([A-Z][A-Za-z-]+(?:\s+[A-Z][A-Za-z-]+)*)\]\s+\(([^)]+)\)\]\]/g

  // Pattern for simple traits: [[TraitName]]
  const simplePattern = /\[\[([A-Z][A-Za-z-]+(?:\s+[A-Z][A-Za-z-]+)*)\]\]/g

  // Find all parameterized trait references first
  let match: RegExpExecArray | null
  while ((match = paramPattern.exec(text)) !== null) {
    references.push({
      fullMatch: match[0],
      traitName: match[1],
      parameter: match[2],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    })
  }

  // Find all simple trait references
  while ((match = simplePattern.exec(text)) !== null) {
    // Skip if this position is already covered by a parameterized match
    const isAlreadyMatched = references.some(
      (ref) => match!.index >= ref.startIndex && match!.index < ref.endIndex
    )

    if (!isAlreadyMatched) {
      references.push({
        fullMatch: match[0],
        traitName: match[1],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      })
    }
  }

  // Sort by start index
  references.sort((a, b) => a.startIndex - b.startIndex)

  return references
}
