import type { SURefEntity, SURefMetaEntity, SURefSchemaName } from 'salvageunion-reference'

export interface Stat {
  label: string
  bottomLabel?: string
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
export function getSchemaDisplayName(schemaName: SURefSchemaName | 'actions'): string {
  const displayNames: Partial<Record<SURefSchemaName | 'actions', string>> = {
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
  schemaName: SURefSchemaName | 'actions' | undefined,
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
export function extractHeaderStats(data: SURefMetaEntity): Stat[] {
  const stats: Stat[] = []

  const chassisStats = 'stats' in data && typeof data.stats === 'object' ? data.stats : undefined

  if (chassisStats) {
    if (chassisStats.structurePts) {
      stats.push({ label: 'SP', value: chassisStats.structurePts })
    }
    if (chassisStats.energyPts) {
      stats.push({ label: 'EP', value: chassisStats.energyPts })
    }
    if (chassisStats.heatCap) {
      stats.push({ label: 'Heat', value: chassisStats.heatCap })
    }
    if (chassisStats.systemSlots) {
      stats.push({ label: 'Sys.', bottomLabel: 'Slots', value: chassisStats.systemSlots })
    }
    if (chassisStats.moduleSlots) {
      stats.push({ label: 'Mod.', bottomLabel: 'Slots', value: chassisStats.moduleSlots })
    }
    if (chassisStats.cargoCap) {
      stats.push({ label: 'Cargo', bottomLabel: 'Cap', value: chassisStats.cargoCap })
    }
    if (chassisStats.salvageValue) {
      stats.push({ label: 'Salvage', bottomLabel: 'Value', value: chassisStats.salvageValue })
    }
    if (chassisStats.techLevel) {
      stats.push({ label: 'Tech', bottomLabel: 'Level', value: chassisStats.techLevel })
    }
  }

  if ('hitPoints' in data && !!data.hitPoints) {
    const label = 'damageType' in data && data.damageType ? data.damageType : 'HP'
    stats.push({ label, value: data.hitPoints })
  }

  if ('structurePoints' in data && !!data.structurePoints) {
    stats.push({ label: 'SP', value: data.structurePoints })
  }

  return stats
}

/**
 * Extract sidebar data (tech level, salvage value, slots)
 */
export function extractSidebarData(data: SURefMetaEntity): SidebarData {
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

  const showSidebar = !!salvageValue || !!slotsRequired

  return {
    showSidebar,
    salvageValue,
    slotsRequired,
  }
}

/**
 * Determine which content sections to show
 */
export function extractContentSections(data: SURefMetaEntity): ContentSections {
  return {
    showStatBonus: 'statBonus' in data && !!data.statBonus,
    showActions: 'actions' in data && !!data.actions && data.actions.length > 0,
    showRollTable: 'table' in data && !!data.table,
    showSystems: 'systems' in data && !!data.systems && data.systems.length > 0,
    showAbilities:
      'techLevelEffects' in data && data.techLevelEffects && data.techLevelEffects.length > 0,
  }
}

/**
 * Extract header text
 */
export function extractHeader(
  data: SURefMetaEntity,
  schemaName: SURefSchemaName | 'actions'
): string {
  // AbilityTreeRequirement uses 'tree' instead of 'name'
  if (schemaName === 'ability-tree-requirements' && 'tree' in data) {
    return `${data.tree} Tree`
  }
  return (data as { name: string }).name
}

/**
 * Extract level (for abilities)
 */
export function extractLevel(data: SURefMetaEntity): string | number | undefined {
  return 'level' in data ? data.level : undefined
}

/**
 * Extract description
 */
export function extractDescription(data: SURefMetaEntity): string | undefined {
  return 'description' in data ? data.description : undefined
}

/**
 * Extract notes
 */
export function extractNotes(data: SURefMetaEntity): string | undefined {
  return 'notes' in data ? data.notes : undefined
}

/**
 * Check if entity has page reference
 */
export function hasPageReference(data: SURefMetaEntity): boolean {
  return 'page' in data
}

export function extractOptions(
  data: SURefMetaEntity
): string[] | { label: string; value: string }[] | undefined {
  return 'options' in data ? data.options : undefined
}

export function extractTechLevel(data: SURefMetaEntity): number | undefined {
  if ('stats' in data && typeof data.stats === 'object' && data.stats) {
    return (data.stats as { techLevel?: number }).techLevel
  } else if ('techLevel' in data) {
    return data.techLevel as number | undefined
  }
  return undefined
}

export function extractTechLevelEffects(data: SURefMetaEntity): {
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
export function extractPageReference(data: SURefMetaEntity): {
  source?: string
  page: number
} | null {
  if (!('page' in data && typeof data.page === 'number')) return null
  return {
    source: 'source' in data ? data.source : undefined,
    page: data.page as number,
  }
}
