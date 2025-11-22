import { useState, useMemo, type ReactNode } from 'react'
import type { ButtonProps } from '@chakra-ui/react'
import type { SURefEntity, SURefEnumSchemaName } from 'salvageunion-reference'
import {
  getTechLevel,
  hasActions,
  getChassisAbilities,
  getEffects,
  getTable,
  getAssetUrl,
  extractVisibleActions,
  filterActionsExcludingName,
  findActionByName,
} from 'salvageunion-reference'
import { techLevelColors } from '@/theme'
import {
  calculateBackgroundColor,
  extractName,
  getContentBackground,
  calculateOpacity,
  shouldShowExtraContent as calculateShouldShowExtraContent,
  createHeaderClickHandler,
  getEntityDisplayName,
} from '@/components/entity/entityDisplayHelpers'
import {
  EntityDisplayContext,
  getEntityFontSizes,
  getEntitySpacing,
  type EntityDisplayContextValue,
} from './entityDisplayContext'

interface EntityDisplayProviderProps {
  data: SURefEntity
  schemaName: SURefEnumSchemaName
  compact: boolean
  headerColor?: string
  dimHeader: boolean
  disabled: boolean
  hideActions: boolean
  hidePatterns: boolean
  hideChoices: boolean
  showFooter?: boolean
  collapsible: boolean
  defaultExpanded: boolean
  onClick?: () => void
  hideLevel: boolean
  expanded?: boolean
  rightLabel?: string
  rightContent?: ReactNode
  damaged?: boolean
  buttonConfig?: ButtonProps & { children: ReactNode }
  userChoices?: Record<string, string> | null
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
  onToggleExpanded?: () => void
  children?: ReactNode
  hideImage?: boolean
  imageWidth?: string
}

export function EntityDisplayProvider({
  data,
  schemaName,
  compact,
  headerColor,
  dimHeader,
  disabled,
  hideActions,
  hidePatterns,
  hideChoices,
  showFooter,
  collapsible,
  expanded,
  defaultExpanded,
  onClick,
  hideLevel,
  rightLabel,
  rightContent,
  damaged = false,
  buttonConfig,
  userChoices,
  onChoiceSelection,
  onToggleExpanded,
  children,
  hideImage,
  imageWidth,
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
  const calculatedHeaderBg = calculateBackgroundColor(
    schemaName,
    headerColor,
    techLevel,
    data,
    techLevelColors
  )
  const headerBg = damaged ? 'su.grey' : calculatedHeaderBg
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

  // Memoize expensive computations
  const entityName = useMemo(() => getEntityDisplayName(data, title), [data, title])

  const hasActionsValue = useMemo(() => hasActions(data), [data])

  const chassisAbilities = useMemo(() => getChassisAbilities(data), [data])

  const effects = useMemo(() => getEffects(data), [data])

  const table = useMemo(() => getTable(data), [data])

  const assetUrl = useMemo(() => getAssetUrl(data), [data])

  const visibleActions = useMemo(() => extractVisibleActions(data), [data])

  const actionsToDisplay = useMemo(() => {
    if (!visibleActions || visibleActions.length === 0) return undefined
    return filterActionsExcludingName(visibleActions, entityName)
  }, [visibleActions, entityName])

  const matchingAction = useMemo(() => {
    if (!hasActionsValue) return undefined
    return findActionByName(data, entityName)
  }, [hasActionsValue, data, entityName])

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
    hidePatterns,
    hideChoices,
    showFooter,
    hideLevel,
    rightLabel,
    rightContent,
    damaged,
    disabled,
    buttonConfig,
    userChoices,
    onChoiceSelection,
    hideImage,
    imageWidth,
    entityName,
    hasActions: hasActionsValue,
    chassisAbilities,
    effects,
    table,
    assetUrl,
    visibleActions,
    actionsToDisplay,
    matchingAction,
  }

  return <EntityDisplayContext.Provider value={value}>{children}</EntityDisplayContext.Provider>
}
