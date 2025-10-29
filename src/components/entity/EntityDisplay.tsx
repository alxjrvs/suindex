import { useState, type ReactNode } from 'react'
import { Box, Button, Flex, Grid, VStack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { DetailsList } from '../shared/DetailsList'
import { StatDisplay } from '../StatDisplay'
import { StatList } from '../shared/StatList'
import { PageReferenceDisplay } from '../shared/PageReferenceDisplay'
import { StatBonusDisplay } from '../shared/StatBonusDisplay'
import { RollTable } from '../shared/RollTable'
import { Text } from '../base/Text'
import { RoundedBox } from '../shared/RoundedBox'
import { techLevelColors } from '../../theme'
import {
  extractHeaderStats,
  extractSidebarData,
  extractContentSections,
  extractHeader,
  extractLevel,
  extractDescription,
  extractNotes,
  extractPageReference,
  extractTechLevelEffects,
  extractTechLevel,
  getSchemaDisplayName,
  extractOptions,
} from './entityDisplayHelpers'
import type { SURefSchemaName, SURefMetaEntity } from 'salvageunion-reference'
import { SheetDisplay } from '../shared/SheetDisplay'
import { LevelDisplay } from '../shared/LevelDisplay'

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
  /** Whether to hide the level display */
  hideLevel?: boolean
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

type SidebarStatsProps = {
  slotsRequired?: number
  salvageValue?: number
  compact: boolean
}

function SidebarStats({ slotsRequired, salvageValue, compact }: SidebarStatsProps) {
  return (
    <>
      {slotsRequired && <StatDisplay label="Slots" value={slotsRequired} compact={compact} />}
      {salvageValue && (
        <StatDisplay label="Salvage" bottomLabel="Value" value={salvageValue} compact={compact} />
      )}
    </>
  )
}

type ItalicTextProps = {
  children: string
  compact: boolean
}

function ItalicText({ children, compact }: ItalicTextProps) {
  return (
    <Text
      color="su.black"
      fontWeight="medium"
      lineHeight="relaxed"
      fontStyle="italic"
      wordBreak="break-word"
      overflowWrap="break-word"
      whiteSpace="normal"
      overflow="hidden"
      maxW="100%"
      fontSize={compact ? 'xs' : 'sm'}
    >
      {children}
    </Text>
  )
}

export function EntityDisplay({
  rightLabel,
  data,
  label,
  headerColor,
  hideLevel = false,
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
  contentJustify = 'flex-start',
  schemaName,
  compact = false,
}: EntityDisplayProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  if (!data) return null

  const header = extractHeader(data, schemaName)
  const level = extractLevel(data)
  const description = extractDescription(data)
  const notes = extractNotes(data)
  const stats = extractHeaderStats(data)
  const sidebar = extractSidebarData(data)
  const sections = extractContentSections(data)
  const pageRef = extractPageReference(data)
  const techLevel = extractTechLevel(data)
  const techLevelEffects = extractTechLevelEffects(data)
  const options = extractOptions(data)

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

  // Click handling for header only
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

  // Build left content (tech level display)
  const leftContentElement = techLevel ? (
    <StatDisplay inverse label="Tech" bottomLabel="Level" value={techLevel} compact={compact} />
  ) : undefined

  // Build subtitle content (details list)
  const subTitleContentElement = header && (
    <DetailsList data={data} schemaName={schemaName} compact={compact} />
  )

  // Build right content (description + stats + collapsible indicator)
  const rightContentElement = (
    <Flex alignItems="center" gap={2} alignSelf="center" maxW="50%" mt={2}>
      {description && schemaName === 'abilities' && (
        <Text
          color="su.white"
          fontStyle="italic"
          textAlign="right"
          fontWeight="medium"
          flex="1"
          maxH="60px"
          css={{
            fontSize: compact ? 'clamp(0.2rem, .6vw, 0.8rem)' : 'clamp(0.3rem, .8vw, 1rem)',
          }}
        >
          {description}
        </Text>
      )}
      {compact && sidebar.showSidebar && (sidebar.slotsRequired || sidebar.salvageValue) && (
        <Flex alignItems="center" flexDirection="row" justifyContent="flex-end" pb={2} gap={2}>
          {stats.length > 0 && <StatList stats={stats} compact={compact} />}
          <SidebarStats
            slotsRequired={sidebar.slotsRequired}
            salvageValue={sidebar.salvageValue}
            compact={compact}
          />
        </Flex>
      )}
      {!compact && stats.length > 0 && (
        <Box ml="auto">
          <StatList stats={stats} compact={compact} />
        </Box>
      )}
      {rightLabel && (
        <Text variant="pseudoheader" fontSize="lg" ml="auto">
          {rightLabel}
        </Text>
      )}
      {collapsible && (
        <Flex alignItems="center" justifyContent="center" minW="25px" alignSelf="center">
          <Text color="su.white" fontSize="lg">
            {isExpanded ? '▼' : '▶'}
          </Text>
        </Flex>
      )}
    </Flex>
  )

  return (
    <RoundedBox
      absoluteElements={level && !hideLevel && <LevelDisplay level={level} compact={compact} />}
      borderWidth="2px"
      compact={compact}
      bg="su.lightBlue"
      headerBg={backgroundColor}
      headerOpacity={headerOpacity}
      w="full"
      leftContent={leftContentElement}
      title={header}
      subTitleContent={subTitleContentElement}
      rightContent={rightContentElement}
      bodyPadding={0}
      onHeaderClick={handleHeaderClick}
      headerTestId="frame-header-container"
      label={label}
    >
      {(!collapsible || isExpanded) && (
        <Flex bg={backgroundColor} w="full" borderBottomRadius="md" overflow="hidden">
          {/* Sidebar */}
          {!compact && sidebar.showSidebar && (sidebar.slotsRequired || sidebar.salvageValue) && (
            <VStack
              alignItems="center"
              justifyContent="flex-start"
              pb={3}
              gap={2}
              minW="80px"
              maxW="80px"
              opacity={contentOpacity}
              borderBottomLeftRadius="md"
            >
              <SidebarStats
                slotsRequired={sidebar.slotsRequired}
                salvageValue={sidebar.salvageValue}
                compact={compact}
              />
            </VStack>
          )}
          {/* Main content area */}
          <VStack
            flex="1"
            bg="su.lightBlue"
            p={compact ? 2 : 3}
            gap={compact ? 3 : 6}
            alignItems="stretch"
            justifyContent={contentJustify}
            minW="0"
            borderBottomRightRadius="md"
            opacity={contentOpacity}
          >
            {notes && <ItalicText compact={compact}>{notes}</ItalicText>}
            {description && schemaName !== 'abilities' && (
              <ItalicText compact={compact}>{description}</ItalicText>
            )}
            {/* Stat Bonus (for Systems/Modules/Equipment) */}
            {sections.showStatBonus && 'statBonus' in data && data.statBonus && (
              <StatBonusDisplay bonus={data.statBonus.bonus} stat={data.statBonus.stat} />
            )}
            {/* Actions (for Systems/Modules/Equipment) */}
            {sections.showActions &&
              'actions' in data &&
              data.actions &&
              data.actions.length > 0 && (
                <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
                  {data.actions.map((action, index) => (
                    <EntityDisplay compact key={index} data={action} schemaName="actions" />
                  ))}
                </VStack>
              )}
            {/* Roll Table (for Systems/Modules/Equipment) */}
            {'effect' in data && data.effect && <SheetDisplay label="Effect" value={data.effect} />}
            {options && (
              <Grid gridTemplateColumns="repeat(2, 1fr)" gridAutoFlow="dense" gap={1}>
                {options.map((option, optIndex) => {
                  const label = typeof option === 'string' ? '' : option.label
                  const value = typeof option === 'string' ? option : option.value
                  return <SheetDisplay key={optIndex} label={label} value={value} />
                })}
              </Grid>
            )}
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
            {/* Systems (for Vehicles and Drones) */}
            {sections.showSystems &&
              'systems' in data &&
              data.systems &&
              data.systems.length > 0 && (
                <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
                  <Heading
                    level="h3"
                    fontSize={compact ? 'md' : 'lg'}
                    fontWeight="bold"
                    color="su.brick"
                  >
                    Systems
                  </Heading>
                  {data.systems.map((system, index) => (
                    <VStack
                      key={index}
                      gap={2}
                      alignItems="stretch"
                      bg="su.white"
                      borderWidth="2px"
                      borderColor="su.black"
                      borderRadius="md"
                      p={compact ? 2 : 3}
                    >
                      <Text fontWeight="bold" color="su.black" fontSize={compact ? 'sm' : 'md'}>
                        {system}
                      </Text>
                    </VStack>
                  ))}
                </VStack>
              )}
            {/* Abilities (for Creatures, BioTitans, NPCs, Squads, Melds, Crawlers) */}
            {sections.showAbilities && (
              <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
                <Heading
                  level="h3"
                  fontSize={compact ? 'md' : 'lg'}
                  fontWeight="bold"
                  color="su.black"
                  textTransform="uppercase"
                >
                  Abilities
                </Heading>
                {techLevelEffects.map((tle, index) => (
                  <SheetDisplay
                    key={index}
                    label={`Tech Level ${tle.techLevelMin}`}
                    value={tle.effect}
                  />
                ))}
              </VStack>
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
