import type {
  SURefMetaEntity,
  SURefMetaSchemaName,
  SURefMetaBonusPerTechLevel,
} from 'salvageunion-reference'
import { getSchemaCatalog } from 'salvageunion-reference'

// Cache the schema catalog for performance
const schemaCatalog = getSchemaCatalog()
const schemaDisplayNameMap = new Map(schemaCatalog.schemas.map((s) => [s.id, s.displayName]))

/**
 * Get display name for schema (for page references, headers, etc.)
 * Uses package metadata for display names
 */
export function getSchemaDisplayName(schemaName: SURefMetaSchemaName): string {
  return schemaDisplayNameMap.get(schemaName) || schemaName
}

/**
 * Get activation currency based on schema name
 */
export function getActivationCurrency(
  schemaName: SURefMetaSchemaName | undefined,
  variable: boolean = false
): 'AP' | 'EP' | 'XP' {
  if (variable) return 'XP'
  if (schemaName === 'systems' || schemaName === 'modules') {
    return 'EP'
  }
  return 'AP'
}

/**
 * Extract level (for abilities)
 */
export function extractLevel(
  data: SURefMetaEntity | SURefMetaBonusPerTechLevel
): string | number | undefined {
  return 'level' in data ? data.level : undefined
}

export function extractName(
  data: SURefMetaEntity | SURefMetaBonusPerTechLevel,
  schemaName: SURefMetaSchemaName
): string {
  // SURefMetaBonusPerTechLevel (SURefMetaStats) doesn't have a name property
  if (!('name' in data)) {
    return ''
  }

  if (schemaName === 'ability-tree-requirements') {
    return data.name + ' Tree Requirements'
  }
  return data.name ?? ''
}

/**
 * Calculate background color for entity display based on schema, tech level, and entity data
 */
export function calculateBackgroundColor(
  schemaName: SURefMetaSchemaName,
  headerColor: string = '',
  techLevel: number | undefined,
  data: SURefMetaEntity | SURefMetaBonusPerTechLevel,
  techLevelColors: Record<number, string>
): string {
  // Schema-specific colors (from old entityDisplayConfig)
  if (schemaName === 'chassis') return 'su.green'
  if (schemaName === 'crawlers') return headerColor || 'su.pink'
  if (schemaName === 'crawler-tech-levels') return headerColor || 'su.pink'
  if (schemaName === 'crawler-bays') return headerColor || 'su.pink'
  if (schemaName === 'creatures') return headerColor || 'su.orange'
  if (schemaName === 'bio-titans') return headerColor || 'su.orange'
  if (schemaName === 'keywords') return headerColor || 'su.orange'
  if (schemaName === 'traits') return headerColor || 'su.orange'
  if (schemaName === 'roll-tables') return headerColor || 'su.orange'
  if (schemaName === 'classes.core') return headerColor || 'su.orange'
  if (schemaName === 'classes.advanced') return headerColor || 'su.pink'

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
