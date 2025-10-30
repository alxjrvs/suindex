import { Box, Flex, VStack, Button } from '@chakra-ui/react'
import { type ReactNode, useState } from 'react'
import type { SURefMetaEntity, SURefSchemaName } from 'salvageunion-reference'
import { techLevelColors } from '../../../theme'
import { PageReferenceDisplay } from '../../shared/PageReferenceDisplay'
import { RollTable } from '../../shared/RollTable'
import { RoundedBox } from '../../shared/RoundedBox'
import { SheetDisplay } from '../../shared/SheetDisplay'
import {
  extractHeader,
  extractContentSections,
  extractPageReference,
  extractTechLevel,
  getSchemaDisplayName,
} from '../entityDisplayHelpers'
import { EntityAbsoluteContent } from './EntityAbsoluteContent'
import { EntitySubTitleElement } from './EntitySubTitleContent'
import { EntityLeftContent } from './EntityLeftContent'
import { EntityRightContent } from './EntityRightContent'
import { EntitySidebar } from './EntitySidebar'
import { EntityChassisPatternDisplay } from './EntityChassisPatternDisplay'
import { EntityTechLevelEffects } from './EntityTechLevelEffects'
import { EntityOptions } from './EntityOptions'
import { EntityTopMatter } from './EntityTopMatter'

type EntityDisplayProps = {
  /** Entity data to display */
  data: SURefMetaEntity | undefined
  /** Schema name for the entity */
  schemaName: SURefSchemaName | 'actions'
  /** Optional header background color override */
  headerColor?: string
  /** Optional header opacity (0-1, defaults to 1) */
  headerOpacity?: number
  /** Optional children to render in the content area */
  children?: ReactNode
  /** Optional click handler for the entity */
  onClick?: () => void
  /** Whether the entity is disabled (affects opacity and click behavior) */
  disabled?: boolean
  /** Whether the entity is dimmed (affects opacity) */
  dimmed?: boolean
  /** Whether the remove button is disabled */
  disableRemove?: boolean
  /** Optional remove handler */
  onRemove?: () => void
  /** Optional custom confirmation message for removal */
  removeConfirmMessage?: string
  /** Whether the entity can be collapsed/expanded */
  collapsible?: boolean
  /** Default expanded state (only used if expanded is not controlled) */
  defaultExpanded?: boolean
  /** Controlled expanded state */
  expanded?: boolean
  /** Callback when expanded state changes */
  onToggleExpanded?: () => void
  /** Whether to show a select button (used in modals) */
  showSelectButton?: boolean
  /** Optional custom text for the select button */
  selectButtonText?: string
  /** Optional label displayed above the entity */
  label?: string
  /** Content justification for the main content area */
  contentJustify?: 'flex-start' | 'flex-end' | 'space-between' | 'stretch'
  /** Optional label displayed in the top-right corner */
  rightLabel?: string
  /** Whether to use compact styling */
  compact?: boolean
  /** Whether to hide the level display */
  hideLevel?: boolean
  /** Whether or not to show the actions */
  hideActions?: boolean
}

function calculateBGColor(
  schemaName: SURefSchemaName | 'actions',
  headerColor: string = '',
  techLevel: number | undefined
) {
  if (schemaName === 'chassis') return 'su.green'
  if (schemaName === 'actions') return 'su.twoBlue'
  if (headerColor) return headerColor
  if (techLevel) return techLevelColors[techLevel]
  return 'su.orange'
}

export function EntityDisplay({
  rightLabel,
  data,
  label,
  hideLevel = false,
  headerColor,
  headerOpacity = 1,
  children,
  onClick,
  disabled = false,
  dimmed = false,
  disableRemove = false,
  onRemove,
  removeConfirmMessage,
  collapsible = false,
  defaultExpanded = true,
  expanded,
  onToggleExpanded,
  showSelectButton = false,
  selectButtonText,
  hideActions = false,
  contentJustify = 'flex-start',
  schemaName,
  compact = false,
}: EntityDisplayProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  if (!data) return null

  const header = extractHeader(data, schemaName)
  const sections = extractContentSections(data)
  const pageRef = extractPageReference(data)
  const techLevel = extractTechLevel(data)

  // Check if there's any content to render (besides actions)
  const hasNotes = 'notes' in data && data.notes
  const hasDescription = 'description' in data && data.description && schemaName !== 'abilities'
  const hasActions = 'actions' in data && data.actions && data.actions.length > 0
  const hasEffect = 'effect' in data && data.effect
  const hasOptions = 'options' in data && data.options && data.options.length > 0
  const hasRollTable = sections.showRollTable && 'table' in data && data.table
  const hasTechLevelEffects =
    'techLevelEffects' in data && data.techLevelEffects && data.techLevelEffects.length > 0
  const hasPatterns = 'patterns' in data && data.patterns && data.patterns.length > 0

  // Only show padding if there's content beyond just actions
  const hasContentBeyondActions =
    hasNotes ||
    hasDescription ||
    hasEffect ||
    hasOptions ||
    hasRollTable ||
    hasTechLevelEffects ||
    hasPatterns ||
    children ||
    showSelectButton ||
    onRemove ||
    pageRef

  const contentPadding =
    hasActions && !hasContentBeyondActions ? (compact ? 1 : 2) : compact ? 1 : 3

  const isExpanded = expanded !== undefined ? expanded : internalExpanded
  const handleToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  const backgroundColor = calculateBGColor(schemaName, headerColor, techLevel)
  const contentOpacity = disabled || dimmed ? 0.5 : 1

  const handleHeaderClick = () => {
    if (showSelectButton) {
      if (collapsible) {
        handleToggle()
      }
    } else {
      if (onClick && !disabled) {
        onClick()
      } else if (collapsible) {
        handleToggle()
      }
    }
  }

  return (
    <RoundedBox
      borderWidth="2px"
      bg="su.lightBlue"
      w="full"
      headerBg={backgroundColor}
      headerOpacity={headerOpacity}
      absoluteElements={
        <EntityAbsoluteContent
          schemaName={schemaName}
          data={data}
          compact={compact}
          hideLevel={hideLevel}
        />
      }
      leftContent={<EntityLeftContent schemaName={schemaName} data={data} compact={compact} />}
      subTitleContent={
        <EntitySubTitleElement schemaName={schemaName} data={data} compact={compact} />
      }
      rightContent={
        <EntityRightContent
          schemaName={schemaName}
          data={data}
          compact={compact}
          isExpanded={isExpanded}
          collapsible={collapsible}
          rightLabel={rightLabel}
        />
      }
      compact={compact}
      title={header}
      bodyPadding="0"
      onHeaderClick={handleHeaderClick}
      headerTestId="frame-header-container"
      label={label}
    >
      {(!collapsible || isExpanded) && (
        <Flex bg={backgroundColor} w="full" borderBottomRadius="md" overflow="hidden">
          {/* Sidebar */}
          <EntitySidebar
            data={data}
            schemaName={schemaName}
            compact={compact}
            contentOpacity={contentOpacity}
          />
          {/* Main content area */}
          <VStack
            flex="1"
            bg="su.lightBlue"
            borderBottomRightRadius="md"
            opacity={contentOpacity}
            p={contentPadding}
            gap={compact ? 3 : 6}
            alignItems="stretch"
            justifyContent={contentJustify}
            minW="0"
          >
            <EntityTopMatter
              hideActions={hideActions}
              data={data}
              schemaName={schemaName}
              compact={compact}
            />
            {!hideActions && (
              <EntityChassisPatternDisplay data={data} schemaName={schemaName} compact={compact} />
            )}

            {'effect' in data && data.effect && (
              <SheetDisplay compact={compact} value={data.effect} />
            )}

            {compact && !hideActions && (
              <EntityOptions data={data} compact={compact} schemaName={schemaName} />
            )}

            {compact && !hideActions && sections.showRollTable && 'table' in data && data.table && (
              <Box borderRadius="md" position="relative" zIndex={10}>
                <RollTable
                  disabled={disabled || dimmed}
                  table={data.table}
                  showCommand
                  compact
                  tableName={'name' in data ? String(data.name) : undefined}
                />
              </Box>
            )}

            {compact && !hideActions && (
              <EntityTechLevelEffects data={data} compact={compact} schemaName={schemaName} />
            )}

            {children && <Box mt="3">{children}</Box>}
            {/* Select Button - Only shown in modal */}
            {showSelectButton && onClick && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!disabled) {
                    onClick()
                  }
                }}
                disabled={disabled}
                w="full"
                mt={3}
                bg="su.orange"
                color="su.white"
                px={4}
                py={2}
                borderRadius="md"
                fontWeight="bold"
                _hover={{ bg: 'su.black' }}
                _disabled={{
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  _hover: { bg: 'su.orange' },
                }}
              >
                {selectButtonText || 'Select'}
              </Button>
            )}
            {/* Remove Button */}
            {onRemove && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  if (disableRemove) return

                  const message =
                    removeConfirmMessage || `Are you sure you want to remove "${header}"?`

                  const confirmed = window.confirm(message)

                  if (confirmed) {
                    onRemove()
                  }
                }}
                disabled={disableRemove}
                w="full"
                mt={3}
                bg="su.brick"
                color="su.white"
                px={4}
                py={2}
                borderRadius="md"
                fontWeight="bold"
                textTransform="uppercase"
                _hover={{ bg: 'su.black' }}
                _disabled={{
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  _hover: { bg: 'su.brick' },
                }}
                aria-label={`Remove ${getSchemaDisplayName(schemaName)}`}
              >
                Remove {getSchemaDisplayName(schemaName)}
              </Button>
            )}
            {/* Page Reference */}
            {pageRef && (
              <Box mt="auto">
                <PageReferenceDisplay
                  source={pageRef.source}
                  page={pageRef.page}
                  schemaName={getSchemaDisplayName(schemaName)}
                />
              </Box>
            )}
          </VStack>
        </Flex>
      )}
    </RoundedBox>
  )
}
