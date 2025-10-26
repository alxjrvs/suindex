import type { SURefEntity, SURefEntityName } from 'salvageunion-reference'
import type { DataValue } from '../../types/common'
import { formatTraits } from '../../utils/displayUtils'

export interface Stat {
  label: string
  value: number | string
}

export interface SidebarData {
  showSidebar: boolean
  techLevel?: 1 | 2 | 3 | 4 | 5 | 6
  salvageValue?: number
  slotsRequired?: number
}

export interface ContentSections {
  showStatBonus: boolean
  showActions: boolean
  showRollTable: boolean
  showSystems: boolean
  showAbilities: boolean
}

/**
 * Detect entity type from data properties
 */
export function detectEntityType(data: SURefEntity): SURefEntityName {
  // AbilityTreeRequirement: has requirement and tree but no name
  if ('requirement' in data && 'tree' in data && !('name' in data)) {
    return 'AbilityTreeRequirement'
  }

  // Table: has table and section
  if ('table' in data && 'section' in data) {
    return 'RollTable'
  }

  // Ability: has tree, level, and name
  if ('tree' in data && 'name' in data) {
    return 'Ability'
  }

  // CrawlerTechLevel: has techLevel and population fields
  if ('techLevel' in data && 'populationMin' in data && 'populationMax' in data) {
    return 'CrawlerTechLevel'
  }

  // Chassis: has stats object with structure_pts
  if (
    'stats' in data &&
    typeof data.stats === 'object' &&
    data.stats &&
    'structure_pts' in data.stats
  ) {
    return 'Chassis'
  }

  // CrawlerBay: has NPC with choices
  if ('npc' in data && typeof data.npc === 'object' && data.npc && 'choices' in data.npc) {
    return 'CrawlerBay'
  }

  // Class: has coreAbilities array
  if ('coreAbilities' in data && Array.isArray(data.coreAbilities)) {
    return 'Class'
  }

  // Crawler: has abilities but no hitPoints/structurePoints
  if ('abilities' in data && !('hitPoints' in data) && !('slotsRequired' in data)) {
    return 'Crawler'
  }

  // System/Module/Equipment: has slotsRequired
  if ('slotsRequired' in data) {
    if ('recommended' in data) return 'Module'
    if ('statBonus' in data || 'table' in data) return 'System'
    return 'Equipment'
  }

  // Entities with hitPoints
  if ('hitPoints' in data) {
    if ('structurePoints' in data) return 'Vehicle'
    if ('abilities' in data && Array.isArray(data.abilities)) {
      // Could be Creature, BioTitan, NPC, Squad, or Meld
      if ('type' in data && typeof data.type === 'string') {
        if (data.type === 'bio-titan') return 'BioTitan'
        if (data.type === 'npc') return 'NPC'
        if (data.type === 'squad') return 'Squad'
        if (data.type === 'meld') return 'Meld'
      }
      return 'Creature'
    }
    return 'Drone'
  }

  // Trait: has type property
  if ('type' in data && typeof data.type === 'string') {
    return 'Trait'
  }

  return 'Keyword'
}

/**
 * Get schema name for display in page reference
 */
export function getSchemaName(entityType: SURefEntityName): string {
  const schemaNames: Record<SURefEntityName, string> = {
    Vehicle: 'Vehicle',
    Creature: 'Creature',
    Drone: 'Drone',
    BioTitan: 'Bio-Titan',
    NPC: 'NPC',
    Squad: 'Squad',
    Meld: 'Meld',
    Keyword: 'Keyword',
    Trait: 'Trait',
    System: 'System',
    Module: 'Module',
    Equipment: 'Equipment',
    Ability: 'Ability',
    AbilityTreeRequirement: 'Ability Tree Requirement',
    Crawler: 'Crawler',
    RollTable: 'Roll Table',
    CrawlerTechLevel: 'Crawler Tech Level',
    Class: 'Class',
    CrawlerBay: 'Crawler Bay',
    Chassis: 'Chassis',
  }
  return schemaNames[entityType]
}

/**
 * Get activation currency based on entity type
 */
export function getActivationCurrency(
  entityType: SURefEntityName,
  variable: boolean = false
): 'AP' | 'EP' | 'XP' {
  if (variable) return 'XP'
  if (entityType === 'System' || entityType === 'Module') {
    return 'EP'
  }
  return 'AP'
}

/**
 * Extract header stats (HP, SP, chassis stats)
 */
export function extractHeaderStats(data: SURefEntity): Stat[] {
  const stats: Stat[] = []

  // Chassis has nested stats object
  if ('stats' in data && typeof data.stats === 'object' && data.stats) {
    const chassisStats = data.stats as {
      structure_pts?: number
      energy_pts?: number
      heat_cap?: number
      system_slots?: number
      module_slots?: number
      cargo_cap?: number
      tech_level?: number
      salvage_value?: number
    }
    if (chassisStats.structure_pts !== undefined) {
      stats.push({ label: 'SP', value: chassisStats.structure_pts })
    }
    if (chassisStats.energy_pts !== undefined) {
      stats.push({ label: 'EP', value: chassisStats.energy_pts })
    }
    if (chassisStats.heat_cap !== undefined) {
      stats.push({ label: 'Heat', value: chassisStats.heat_cap })
    }
    if (chassisStats.system_slots !== undefined) {
      stats.push({ label: 'Sys. Slots', value: chassisStats.system_slots })
    }
    if (chassisStats.module_slots !== undefined) {
      stats.push({ label: 'Mod. Slots', value: chassisStats.module_slots })
    }
    if (chassisStats.cargo_cap !== undefined) {
      stats.push({ label: 'Cargo Cap', value: chassisStats.cargo_cap })
    }
  } else {
    // Regular entities - only HP and SP (not SV)
    if ('hitPoints' in data && data.hitPoints !== undefined) {
      stats.push({ label: 'HP', value: data.hitPoints })
    }
    if ('structurePoints' in data && data.structurePoints !== undefined) {
      stats.push({ label: 'SP', value: data.structurePoints })
    }
  }

  return stats
}

/**
 * Extract details for header (activation cost, range, damage, traits)
 */
export function extractDetails(data: SURefEntity, entityType: SURefEntityName): DataValue[] {
  const details: DataValue[] = []
  const variableCost = 'activationCurrency' in data && entityType === 'Ability'
  const activationCurrency = getActivationCurrency(entityType, variableCost)

  // Activation cost
  if ('activationCost' in data && data.activationCost !== undefined) {
    const isVariable = String(data.activationCost).toLowerCase() === 'variable'
    const costValue = isVariable
      ? `X ${activationCurrency}`
      : `${data.activationCost} ${activationCurrency}`
    details.push({ value: costValue, cost: true })
  }

  // Action type
  if ('actionType' in data && data.actionType) {
    if ('mechActionType' in data && data.mechActionType) {
      const mechActionType = data.mechActionType.includes('action')
        ? data.mechActionType
        : `${data.mechActionType} Action (Mech)`

      const actionType = data.actionType.includes('action')
        ? data.actionType
        : `${data.actionType} Action (Pilot)`

      details.push({ value: mechActionType })
      details.push({ value: actionType })
    } else {
      const actionType = data.actionType.includes('action')
        ? data.actionType
        : `${data.actionType} Action`
      details.push({ value: actionType })
    }
  }

  // Range - no "Range:" prefix for abilities
  if ('range' in data && data.range) {
    const rangeValue = entityType === 'Ability' ? data.range : `Range:${data.range}`
    details.push({ value: rangeValue })
  }

  // Damage
  if ('damage' in data && data.damage) {
    details.push({
      value: `Damage:${data.damage.amount}${data.damage.type}`,
    })
  }

  // Traits
  const traits = 'traits' in data ? formatTraits(data.traits) : []
  traits.forEach((t) => {
    details.push({ value: t })
  })

  // Recommended (for modules)
  if ('recommended' in data && data.recommended) {
    details.push({ value: 'Recommended' })
  }

  return details
}

/**
 * Extract sidebar data (tech level, salvage value, slots)
 */
export function extractSidebarData(data: SURefEntity): SidebarData {
  let techLevel: number | undefined
  let salvageValue: number | undefined
  let slotsRequired: number | undefined

  // Tech level
  if (
    'stats' in data &&
    typeof data.stats === 'object' &&
    data.stats &&
    'tech_level' in data.stats
  ) {
    techLevel = (data.stats as { tech_level?: number }).tech_level
  } else if ('techLevel' in data) {
    techLevel = data.techLevel as number | undefined
  }

  // Salvage value
  if (
    'stats' in data &&
    typeof data.stats === 'object' &&
    data.stats &&
    'salvage_value' in data.stats
  ) {
    salvageValue = (data.stats as { salvage_value?: number }).salvage_value
  } else if ('salvageValue' in data) {
    salvageValue = data.salvageValue as number | undefined
  }

  // Slots required
  if ('slotsRequired' in data) {
    slotsRequired = data.slotsRequired as number | undefined
  }

  const showSidebar =
    techLevel !== undefined || salvageValue !== undefined || slotsRequired !== undefined

  return {
    showSidebar,
    techLevel: techLevel as 1 | 2 | 3 | 4 | 5 | 6 | undefined,
    salvageValue,
    slotsRequired,
  }
}

/**
 * Determine which content sections to show
 */
export function extractContentSections(data: SURefEntity): ContentSections {
  return {
    showStatBonus: 'statBonus' in data && data.statBonus !== undefined,
    showActions: 'actions' in data && data.actions !== undefined && data.actions.length > 0,
    showRollTable: 'table' in data && data.table !== undefined,
    showSystems: 'systems' in data && data.systems !== undefined && data.systems.length > 0,
    showAbilities: 'abilities' in data && data.abilities !== undefined && data.abilities.length > 0,
  }
}

/**
 * Extract header text
 */
export function extractHeader(data: SURefEntity, entityType: SURefEntityName): string {
  // AbilityTreeRequirement uses 'tree' instead of 'name'
  if (entityType === 'AbilityTreeRequirement' && 'tree' in data) {
    return `${data.tree} Tree`
  }
  return (data as { name: string }).name
}

/**
 * Extract level (for abilities)
 */
export function extractLevel(data: SURefEntity): string | number | undefined {
  return 'level' in data ? data.level : undefined
}

/**
 * Extract description
 */
export function extractDescription(data: SURefEntity): string | undefined {
  return 'description' in data ? data.description : undefined
}

/**
 * Extract notes
 */
export function extractNotes(data: SURefEntity): string | undefined {
  return 'notes' in data ? data.notes : undefined
}

/**
 * Check if entity has page reference
 */
export function hasPageReference(data: SURefEntity): boolean {
  return 'page' in data
}

/**
 * Extract page reference data
 */
export function extractPageReference(data: SURefEntity): {
  source?: string
  page: number
} | null {
  if (!hasPageReference(data)) return null
  return {
    source: 'source' in data ? data.source : undefined,
    page: data.page as number,
  }
}
