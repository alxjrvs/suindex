import type { ReactNode } from 'react'
import type { SURefMetaEntity, SURefMetaSchemaName } from 'salvageunion-reference'
import { getTechLevel } from 'salvageunion-reference'
import { techLevelColors } from '../../../theme'
import { calculateBackgroundColor, extractName } from '../entityDisplayHelpers'
import { EntityDisplayContext, type EntityDisplayContextValue } from './entityDisplayContext'

/**
 * Spacing helpers based on compact mode
 */
const getEntitySpacing = (compact: boolean) => ({
  /** Padding for content sections: 1 (compact) or 2 (normal) */
  contentPadding: compact ? 1 : 2,
  /** Gap between small elements: 2 (compact) or 3 (normal) */
  smallGap: compact ? 2 : 3,
  /** Gap between major sections: 3 (compact) or 6 (normal) */
  largeGap: compact ? 3 : 6,
  /** Gap for minimal spacing: 0.5 (compact) or 1 (normal) */
  minimalGap: compact ? 0.5 : 1,
  /** Gap for single spacing: 1 (compact) or 2 (normal) */
  singleGap: compact ? 1 : 2,
})

/**
 * Font size helpers based on compact mode
 */
const getEntityFontSizes = (compact: boolean) => ({
  /** Extra small text */
  xs: compact ? '2xs' : 'xs',
  /** Small text */
  sm: compact ? 'xs' : 'sm',
  /** Medium text */
  md: compact ? 'sm' : 'md',
  /** Large text */
  lg: compact ? 'md' : 'lg',
})

/**
 * Get background color for content area based on schema
 */
const getContentBackground = (schemaName: SURefMetaSchemaName): string => {
  return schemaName === 'actions' ? 'su.blue' : 'su.lightBlue'
}

interface EntityDisplayProviderProps {
  data: SURefMetaEntity
  schemaName: SURefMetaSchemaName
  compact: boolean
  headerColor?: string
  children: ReactNode
}

export function EntityDisplayProvider({
  data,
  schemaName,
  compact,
  headerColor,
  children,
}: EntityDisplayProviderProps) {
  const title = extractName(data, schemaName)
  const techLevel = getTechLevel(data)
  const headerBg = calculateBackgroundColor(
    schemaName,
    headerColor,
    techLevel,
    data,
    techLevelColors
  )
  const spacing = getEntitySpacing(compact)
  const fontSize = getEntityFontSizes(compact)
  const contentBg = getContentBackground(schemaName)

  const value: EntityDisplayContextValue = {
    data,
    schemaName,
    compact,
    title,
    techLevel,
    headerBg,
    spacing,
    fontSize,
    contentBg,
  }

  return <EntityDisplayContext.Provider value={value}>{children}</EntityDisplayContext.Provider>
}
