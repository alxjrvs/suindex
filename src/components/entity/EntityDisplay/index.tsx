import { Box, Flex, VStack, Button } from '@chakra-ui/react'
import { type ReactNode, useState } from 'react'
import type {
  SURefAdvancedClass,
  SURefCoreClass,
  SURefHybridClass,
  SURefMetaEntity,
  SURefSchemaName,
} from 'salvageunion-reference'
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
import { EntityRequirementDisplay } from './EntityRequirementDisplay'
import { ClassAbilitiesList } from '../../PilotLiveSheet/ClassAbilitiesList'

type EntityDisplayProps = {
  /** Entity data to display */
  data: SURefMetaEntity | undefined
  /** Schema name for the entity */
  schemaName: SURefSchemaName | 'actions'
  /** Optional header background color override */
  headerColor?: string
  /** Whether the ability is trained (affects header opacity for abilities) */
  trained?: boolean
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
  techLevel: number | undefined,
  data: SURefMetaEntity
) {
  if (schemaName === 'chassis') return 'su.green'
  if (schemaName === 'actions') return 'su.twoBlue'

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

export function EntityDisplay({
  rightLabel,
  data,
  hideLevel = false,
  headerColor,
  trained = true,
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
  schemaName,
  compact = false,
}: EntityDisplayProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

  if (!data) return null

  const header = extractHeader(data, schemaName)
  const sections = extractContentSections(data)
  const pageRef = extractPageReference(data)
  const techLevel = extractTechLevel(data)

  const backgroundColor = calculateBGColor(schemaName, headerColor, techLevel, data)
  const headerOpacity = trained ? 1 : 0.5
  const contentOpacity = disabled || dimmed ? 0.5 : 1

  // Check if there's any content to render
  const hasContent =
    ('actions' in data && data.actions && data.actions.length > 0) ||
    ('notes' in data && !!data.notes) ||
    ('description' in data && !!data.description && schemaName !== 'abilities') ||
    ('effect' in data && !!data.effect) ||
    ('options' in data && data.options && data.options.length > 0) ||
    (sections.showRollTable && 'table' in data && !!data.table) ||
    ('techLevelEffects' in data && data.techLevelEffects && data.techLevelEffects.length > 0) ||
    ('patterns' in data && data.patterns && data.patterns.length > 0) ||
    !!children ||
    showSelectButton ||
    !!onRemove ||
    !!pageRef

  const isExpanded = expanded !== undefined ? expanded : internalExpanded

  const handleToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  const handleHeaderClick = () => {
    if (showSelectButton && collapsible) {
      handleToggle()
    } else if (onClick && !disabled) {
      onClick()
    } else if (collapsible) {
      handleToggle()
    }
  }

  const displayExtraSection = compact ? !hideActions : true

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
    >
      {(!collapsible || isExpanded) && hasContent && (
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
            p={compact ? 1 : 3}
            gap={compact ? 3 : 6}
            alignItems="stretch"
            minW="0"
          >
            <EntityTopMatter
              hideActions={hideActions}
              data={data}
              schemaName={schemaName}
              compact={compact}
            />

            {'effect' in data && data.effect && (
              <SheetDisplay compact={compact} value={data.effect} />
            )}

            {displayExtraSection && (
              <>
                <EntityChassisPatternDisplay
                  data={data}
                  schemaName={schemaName}
                  compact={compact}
                />
                <EntityOptions data={data} compact={compact} schemaName={schemaName} />
                {sections.showRollTable && 'table' in data && data.table && (
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
                <EntityTechLevelEffects data={data} compact={compact} schemaName={schemaName} />
                {'damagedEffect' in data && data.damagedEffect && compact && (
                  <SheetDisplay
                    labelBgColor="su.brick"
                    borderColor="su.brick"
                    label="Damaged Effect"
                    value={data.damagedEffect}
                  />
                )}
                <EntityRequirementDisplay data={data} compact={compact} schemaName={schemaName} />
                <ClassAbilitiesList
                  selectedClass={
                    schemaName === 'classes.core' ? (data as SURefCoreClass) : undefined
                  }
                  selectedAdvancedClass={
                    schemaName === 'classes.advanced' || schemaName === 'classes.hybrid'
                      ? (data as SURefAdvancedClass | SURefHybridClass)
                      : undefined
                  }
                />
                {children && <Box mt="3">{children}</Box>}
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
              </>
            )}
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
