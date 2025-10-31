import type { SURefMetaEntity, SURefMetaSchemaName, SURefSchemaName } from 'salvageunion-reference'

/**
 * Extract image path for an entity based on schema and entity properties
 * Returns the path to the image in the public directory, or undefined if no image exists
 */
export function extractImagePath(
  data: SURefMetaEntity,
  schemaName: SURefSchemaName | 'actions'
): string {
  return `/images/${schemaName}/${data.name.toLowerCase()}.png`
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
  showTLE: boolean
}

/**
 * Get display name for schema (for page references, headers, etc.)
 */
export function getSchemaDisplayName(schemaName: SURefMetaSchemaName | 'actions'): string {
  const displayNames: Partial<Record<SURefMetaSchemaName | 'actions', string>> = {
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
  schemaName: SURefMetaSchemaName | 'actions' | undefined,
  variable: boolean = false
): 'AP' | 'EP' | 'XP' {
  if (variable) return 'XP'
  if (schemaName === 'systems' || schemaName === 'modules') {
    return 'EP'
  }
  return 'AP'
}

/**

 * Extract sidebar data (tech level, salvage value, slots)
 */
export function extractSidebarData(
  data: SURefMetaEntity,
  schemaName: SURefMetaSchemaName
): SidebarData {
  let salvageValue: number | undefined
  let slotsRequired: number | undefined

  // Salvage value

  if ('salvageValue' in data) {
    salvageValue = data.salvageValue as number | undefined
  }

  // Slots required
  if ('slotsRequired' in data) {
    slotsRequired = data.slotsRequired as number | undefined
  }

  const showSidebar =
    schemaName === 'modules' || schemaName === 'systems' || schemaName === 'actions'

  return {
    showSidebar,
    salvageValue,
    slotsRequired,
  }
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

export function extractName(data: SURefMetaEntity, schemaName: SURefMetaSchemaName): string {
  if (schemaName === 'ability-tree-requirements') {
    return data.name + ' Tree Requirements'
  }
  return data.name
}

/**
 * Calculate background color for entity display based on schema, tech level, and entity data
 */
export function calculateBackgroundColor(
  schemaName: SURefSchemaName | 'actions',
  headerColor: string = '',
  techLevel: number | undefined,
  data: SURefMetaEntity,
  techLevelColors: Record<number, string>
): string {
  if (schemaName === 'chassis') return 'su.green'
  if (schemaName === 'actions') {
    if (techLevel) return techLevelColors[techLevel]
    return 'su.threeBlue'
  }

  // Auto-calculate header color for abilities based on type
  if (schemaName === 'abilities' && !headerColor) {
    const isLegendary =
      ('level' in data && String(data.level).toUpperCase() === 'L') ||
      ('tree' in data && String(data.tree).includes('Legendary'))
    const isAdvancedOrHybrid =
      'tree' in data &&
      (String(data.tree).includes('Advanced') || String(data.tree).includes('Hybrid'))

    if (isLegendary) {
      return 'su.pink'
    } else if (isAdvancedOrHybrid) {
      return 'su.darkOrange'
    } else {
      return 'su.orange'
    }
  }

  // Auto-calculate header color for ability-tree-requirements based on name
  if (schemaName === 'ability-tree-requirements' && !headerColor) {
    const name = 'name' in data ? String(data.name).toLowerCase() : ''
    if (name.includes('legendary')) {
      return 'su.pink'
    } else if (name.includes('advanced') || name.includes('hybrid')) {
      return 'su.brick'
    }
    return 'su.orange'
  }

  if (headerColor) return headerColor
  if (techLevel) return techLevelColors[techLevel]
  return 'su.orange'
}
