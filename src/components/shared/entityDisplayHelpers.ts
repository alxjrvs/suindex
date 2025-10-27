import type { SURefActionMetaList, SURefEntity, SURefSchemaName } from 'salvageunion-reference'

export interface Stat {
  label: string
  value: number | string
}

export interface SidebarData {
  showSidebar: boolean
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
 * Detect schema name from data properties
 */
export function detectSchemaName(data: SURefEntity): SURefSchemaName {
  // AbilityTreeRequirement: has requirement and tree but no name
  if ('requirement' in data && 'tree' in data && !('name' in data)) {
    return 'ability-tree-requirements'
  }

  // Table: has table and section
  if ('table' in data && 'section' in data) {
    return 'roll-tables'
  }

  // Ability: has tree, level, and name
  if ('tree' in data && 'name' in data) {
    return 'abilities'
  }

  // CrawlerTechLevel: has techLevel and population fields
  if ('techLevel' in data && 'populationMin' in data && 'populationMax' in data) {
    return 'crawler-tech-levels'
  }

  // Chassis: has stats object with structure_pts
  if (
    'stats' in data &&
    typeof data.stats === 'object' &&
    data.stats &&
    'structure_pts' in data.stats
  ) {
    return 'chassis'
  }

  // CrawlerBay: has NPC with choices
  if ('npc' in data && typeof data.npc === 'object' && data.npc && 'choices' in data.npc) {
    return 'crawler-bays'
  }

  // Class: has coreAbilities array
  if ('coreAbilities' in data && Array.isArray(data.coreAbilities)) {
    // Determine which class type - for now return generic 'classes.core'
    // Could be enhanced to detect core/advanced/hybrid
    return 'classes.core'
  }

  // Crawler: has abilities but no hitPoints/structurePoints
  if ('abilities' in data && !('hitPoints' in data) && !('slotsRequired' in data)) {
    return 'crawlers'
  }

  // System/Module/Equipment: has slotsRequired
  if ('slotsRequired' in data) {
    if ('recommended' in data) return 'modules'
    if ('statBonus' in data || 'table' in data) return 'systems'
    return 'equipment'
  }

  // Entities with hitPoints
  if ('hitPoints' in data) {
    if ('structurePoints' in data) return 'vehicles'
    if ('abilities' in data && Array.isArray(data.abilities)) {
      // Could be Creature, BioTitan, NPC, Squad, or Meld
      if ('type' in data && typeof data.type === 'string') {
        if (data.type === 'bio-titan') return 'bio-titans'
        if (data.type === 'npc') return 'npcs'
        if (data.type === 'squad') return 'squads'
        if (data.type === 'meld') return 'meld'
      }
      return 'creatures'
    }
    return 'drones'
  }

  // Trait: has type property
  if ('type' in data && typeof data.type === 'string') {
    return 'traits'
  }

  return 'keywords'
}

/**
 * Get display name for schema (for page references, headers, etc.)
 */
export function getSchemaDisplayName(schemaName: SURefSchemaName): string {
  const displayNames: Partial<Record<SURefSchemaName, string>> = {
    vehicles: 'Vehicle',
    creatures: 'Creature',
    drones: 'Drone',
    'bio-titans': 'Bio-Titan',
    npcs: 'NPC',
    squads: 'Squad',
    meld: 'Meld',
    keywords: 'Keyword',
    traits: 'Trait',
    systems: 'System',
    modules: 'Module',
    equipment: 'Equipment',
    abilities: 'Ability',
    'ability-tree-requirements': 'Ability Tree Requirement',
    crawlers: 'Crawler',
    'roll-tables': 'Roll Table',
    'crawler-tech-levels': 'Crawler Tech Level',
    'classes.core': 'Class',
    'classes.advanced': 'Advanced Class',
    'classes.hybrid': 'Hybrid Class',
    'crawler-bays': 'Crawler Bay',
    chassis: 'Chassis',
  }
  return displayNames[schemaName] || schemaName
}

/**
 * Get activation currency based on schema name
 */
export function getActivationCurrency(
  schemaName: SURefSchemaName | undefined,
  variable: boolean = false
): 'AP' | 'EP' | 'XP' {
  if (variable) return 'XP'
  if (schemaName === 'systems' || schemaName === 'modules') {
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
      systemSlots?: number
      moduleSlots?: number
      cargoCap?: number
      techLevel?: number
      salvageValue?: number
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
    if (chassisStats.systemSlots !== undefined) {
      stats.push({ label: 'Sys. Slots', value: chassisStats.systemSlots })
    }
    if (chassisStats.moduleSlots !== undefined) {
      stats.push({ label: 'Mod. Slots', value: chassisStats.moduleSlots })
    }
    if (chassisStats.cargoCap !== undefined) {
      stats.push({ label: 'Cargo Cap', value: chassisStats.cargoCap })
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
 * Extract sidebar data (tech level, salvage value, slots)
 */
export function extractSidebarData(data: SURefEntity): SidebarData {
  let salvageValue: number | undefined
  let slotsRequired: number | undefined

  // Salvage value
  if (
    'stats' in data &&
    typeof data.stats === 'object' &&
    data.stats &&
    'salvageValue' in data.stats
  ) {
    salvageValue = (data.stats as { salvageValue?: number }).salvageValue
  } else if ('salvageValue' in data) {
    salvageValue = data.salvageValue as number | undefined
  }

  // Slots required
  if ('slotsRequired' in data) {
    slotsRequired = data.slotsRequired as number | undefined
  }

  const showSidebar = salvageValue !== undefined || slotsRequired !== undefined

  return {
    showSidebar,
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
    showAbilities:
      ('abilities' in data && data.abilities !== undefined && data.abilities.length > 0) ||
      ('techLevelEffects' in data &&
        data.techLevelEffects !== undefined &&
        data.techLevelEffects.length > 0),
  }
}

/**
 * Extract header text
 */
export function extractHeader(data: SURefEntity, schemaName: SURefSchemaName): string {
  // AbilityTreeRequirement uses 'tree' instead of 'name'
  if (schemaName === 'ability-tree-requirements' && 'tree' in data) {
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

export function extractOptions(
  data: SURefEntity
): string[] | { label: string; value: string }[] | undefined {
  return 'options' in data ? data.options : undefined
}

export function extractAbilities(data: SURefEntity): SURefActionMetaList[] {
  const abilities = 'abilities' in data ? data.abilities : undefined
  if (!abilities) return []
  return abilities
}

export function extractTechLevel(data: SURefEntity): number | undefined {
  if ('stats' in data && typeof data.stats === 'object' && data.stats) {
    return (data.stats as { techLevel?: number }).techLevel
  } else if ('techLevel' in data) {
    return data.techLevel as number | undefined
  }
  return undefined
}

export function extractTechLevelEffects(data: SURefEntity): {
  techLevelMin: number
  techLevelMax: number
  effect: string
}[] {
  const techLevelEffects = 'techLevelEffects' in data ? data.techLevelEffects : undefined
  if (!techLevelEffects) return []
  return techLevelEffects
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
