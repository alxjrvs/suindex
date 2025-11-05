import { useState, type ReactNode } from 'react'
import type { ButtonProps } from '@chakra-ui/react'
import type { SURefMetaEntity, SURefMetaSchemaName } from 'salvageunion-reference'
import { getTechLevel } from 'salvageunion-reference'
import { techLevelColors } from '../../../theme'
import {
  calculateBackgroundColor,
  extractName,
  getContentBackground,
  calculateOpacity,
  shouldShowExtraContent as calculateShouldShowExtraContent,
  createHeaderClickHandler,
} from '../entityDisplayHelpers'
import {
  EntityDisplayContext,
  getEntityFontSizes,
  getEntitySpacing,
  type EntityDisplayContextValue,
} from './entityDisplayContext'

interface EntityDisplayProviderProps {
  data: SURefMetaEntity
  schemaName: SURefMetaSchemaName
  compact: boolean
  headerColor?: string
  dimHeader: boolean
  disabled: boolean
  hideActions: boolean
  collapsible: boolean
  defaultExpanded: boolean
  onClick?: () => void
  hideLevel: boolean
  expanded?: boolean
  rightLabel?: string
  buttonConfig?: ButtonProps & { children: ReactNode }
  userChoices?: Record<string, string> | null
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
  onToggleExpanded?: () => void
  children?: ReactNode
}

export function EntityDisplayProvider({
  data,
  schemaName,
  compact,
  headerColor,
  dimHeader,
  disabled,
  hideActions,
  collapsible,
  expanded,
  defaultExpanded,
  onClick,
  hideLevel,
  rightLabel,
  buttonConfig,
  userChoices,
  onChoiceSelection,
  onToggleExpanded,
  children,
}: EntityDisplayProviderProps) {
  const hasButtonConfig = !!buttonConfig
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const isExpanded = expanded !== undefined ? expanded : internalExpanded

  const onToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }
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
  const opacity = calculateOpacity(dimHeader, disabled)
  const shouldShowExtraContent = calculateShouldShowExtraContent(compact, hideActions)
  const handleHeaderClick = createHeaderClickHandler(
    hasButtonConfig,
    collapsible,
    onClick,
    disabled,
    onToggle
  )

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
    opacity,
    shouldShowExtraContent,
    handleHeaderClick,
    isExpanded,
    collapsible,
    hideActions,
    hideLevel,
    rightLabel,
    disabled,
    buttonConfig,
    userChoices,
    onChoiceSelection,
  }

  return <EntityDisplayContext.Provider value={value}>{children}</EntityDisplayContext.Provider>
}
