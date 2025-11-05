import type { ReactNode } from 'react'
import type { SURefMetaEntity, SURefMetaSchemaName } from 'salvageunion-reference'
import { getTechLevel } from 'salvageunion-reference'
import { techLevelColors } from '../../../theme'
import { calculateBackgroundColor, extractName } from '../entityDisplayHelpers'
import {
  EntityDisplayContext,
  getEntityFontSizes,
  getEntitySpacing,
  type EntityDisplayContextValue,
} from './entityDisplayContext'

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
