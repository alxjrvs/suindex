import { createContext } from 'react'
import type { SURefMetaEntity, SURefMetaSchemaName } from 'salvageunion-reference'

/**
 * Spacing helpers based on compact mode
 */
export const getEntitySpacing = (compact: boolean) => ({
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
export const getEntityFontSizes = (compact: boolean) => ({
  /** Extra small text */
  xs: compact ? '2xs' : 'xs',
  /** Small text */
  sm: compact ? 'xs' : 'sm',
  /** Medium text */
  md: compact ? 'sm' : 'md',
  /** Large text */
  lg: compact ? 'md' : 'lg',
})

export interface EntityDisplayContextValue {
  /** Entity data */
  data: SURefMetaEntity
  /** Schema name */
  schemaName: SURefMetaSchemaName
  /** Compact mode flag */
  compact: boolean
  /** Computed entity name */
  title: string
  /** Computed tech level */
  techLevel: number | undefined
  /** Computed header background color */
  headerBg: string
  /** Spacing values */
  spacing: ReturnType<typeof getEntitySpacing>
  /** Font size values */
  fontSize: ReturnType<typeof getEntityFontSizes>
  /** Content background color */
  contentBg: string
}

export const EntityDisplayContext = createContext<EntityDisplayContextValue | null>(null)
