import type {
  SURefMetaEntity,
  SURefEnumSchemaName,
  SURefObjectBonusPerTechLevel,
} from 'salvageunion-reference'
import { getBlackMarket, isHybridClass } from 'salvageunion-reference'

/**
 * Local type that extends SURefEnumSchemaName to include meta schemas like 'actions'
 */
type SURefMetaSchemaName = SURefEnumSchemaName | 'actions'

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

export function extractName(
  data: SURefMetaEntity | SURefObjectBonusPerTechLevel,
  schemaName: SURefEnumSchemaName
): string {
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
  data: SURefMetaEntity | SURefObjectBonusPerTechLevel,
  techLevelColors: Record<number, string>
): string {
  // Check for Black Market items first - they get dark grey background
  if (
    'id' in data &&
    'name' in data &&
    'source' in data &&
    'page' in data &&
    getBlackMarket(data) === true
  ) {
    return 'su.darkGrey'
  }

  if (schemaName === 'chassis') return 'su.green'
  if (schemaName === 'crawlers') return headerColor || 'su.pink'
  if (schemaName === 'crawler-tech-levels') return headerColor || 'su.pink'
  if (schemaName === 'crawler-bays') return headerColor || 'su.pink'
  if (schemaName === 'creatures') return headerColor || 'su.orange'
  if (schemaName === 'bio-titans') return headerColor || 'su.orange'
  if (schemaName === 'keywords') return headerColor || 'su.orange'
  if (schemaName === 'traits') return headerColor || 'su.orange'
  if (schemaName === 'roll-tables') return headerColor || 'su.orange'
  if (schemaName === 'classes' && !headerColor) {
    // Base class (hybrid is false or missing) -> pilot orange
    // Hybrid class -> legendary color (pink)
    // Check if data is a valid entity (not SURefObjectBonusPerTechLevel)
    if ('id' in data && 'name' in data && 'source' in data && 'page' in data) {
      const isHybrid = isHybridClass(data as SURefMetaEntity)
      return isHybrid ? 'su.pink' : 'su.orange'
    }
    return 'su.orange'
  }
  if (schemaName === 'classes') return headerColor || 'su.orange'

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

/**
 * Get background color for content area based on schema
 */
export function getContentBackground(schemaName: SURefMetaSchemaName): string {
  return schemaName === 'actions' ? 'su.blue' : 'su.lightBlue'
}

/**
 * Calculate opacity values for entity display
 */
export function calculateOpacity(dimHeader: boolean, disabled: boolean) {
  return {
    header: dimHeader ? 0.5 : 1,
    content: disabled ? 0.5 : 1,
  }
}

/**
 * Determine which action to take when header is clicked
 * Priority order:
 * 1. If there's a button config and it's collapsible, toggle
 * 2. If there's an onClick handler and not disabled, call it
 * 3. If collapsible, toggle
 */
export function createHeaderClickHandler(
  hasButtonConfig: boolean,
  collapsible: boolean,
  onClick: (() => void) | undefined,
  disabled: boolean,
  onToggle: () => void
): () => void {
  return () => {
    if (hasButtonConfig && collapsible) {
      onToggle()
      return
    }

    if (onClick && !disabled) {
      onClick()
      return
    }

    if (collapsible) {
      onToggle()
    }
  }
}

/**
 * Determine if extra content should be shown based on compact mode and hideActions flag
 * In compact mode, only show extra sections if actions are not hidden
 * In normal mode, always show extra sections
 */
export function shouldShowExtraContent(compact: boolean, hideActions: boolean): boolean {
  return compact ? !hideActions : true
}
