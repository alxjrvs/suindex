import { useState, type ReactNode } from 'react'
import { Box, Button, Flex, VStack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { DetailsList } from './DetailsList'
import { StatDisplay } from '../StatDisplay'
import { StatList } from './StatList'
import { ActionCard } from './ActionCard'
import { PageReferenceDisplay } from './PageReferenceDisplay'
import { StatBonusDisplay } from './StatBonusDisplay'
import { RollTable } from './RollTable'
import { Text } from '../base/Text'
import { RoundedBox } from './RoundedBox'
import { techLevelColors } from '../../theme'
import {
  getActivationCurrency,
  extractHeaderStats,
  extractSidebarData,
  extractContentSections,
  extractHeader,
  extractLevel,
  extractDescription,
  extractNotes,
  extractPageReference,
  extractTechLevelEffects,
  extractAbilities,
  extractTechLevel,
  getSchemaDisplayName,
} from './entityDisplayHelpers'
import type { SURefEntity, SURefSchemaName } from 'salvageunion-reference'
import { SheetDisplay } from './SheetDisplay'

interface EntityDisplayProps {
  data: SURefEntity | undefined
  headerColor?: string
  headerOpacity?: number
  actionHeaderBgColor?: string
  children?: ReactNode
  onClick?: () => void
  disabled?: boolean
  dimmed?: boolean
  disableRemove?: boolean
  onRemove?: () => void
  removeConfirmMessage?: string
  collapsible?: boolean
  defaultExpanded?: boolean
  expanded?: boolean
  onToggleExpanded?: () => void
  showSelectButton?: boolean
  selectButtonText?: string
  label?: string
  contentJustify?: 'flex-start' | 'flex-end' | 'space-between' | 'stretch'
  rightLabel?: string
  schemaName: SURefSchemaName
  compact?: boolean
}

function calculateBGColor(
  sChassis: boolean,
  headerColor: string = '',
  techLevel: number | undefined
) {
  if (sChassis) {
    return 'su.green'
  }
  if (headerColor) {
    return headerColor
  }
  if (techLevel) {
    return techLevelColors[techLevel]
  }
  return 'su.orange'
}

export function EntityDisplay({
  rightLabel,
  data,
  label,
  headerColor,
  headerOpacity = 1,
  actionHeaderBgColor,
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

  const variableCost = 'activationCurrency' in data && schemaName === 'abilities'
  const activationCurrency = getActivationCurrency(schemaName, variableCost)

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
  const abilities = extractAbilities(data)

  // Detect entity type from data properties
  const isModule = schemaName === 'modules'
  const isSystem = schemaName === 'systems'
  const isEquipment = schemaName === 'equipment'
  const isChassis = schemaName === 'chassis'
  const isTrait = schemaName === 'traits'
  const isClass =
    schemaName === 'classes.core' ||
    schemaName === 'classes.advanced' ||
    schemaName === 'classes.hybrid'
  const headerDescription =
    !isClass && !isTrait && !isEquipment && !isModule && !isSystem && !isChassis

  // Expansion state management (from Frame)
  const isExpanded = expanded !== undefined ? expanded : internalExpanded
  const handleToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  const backgroundColor = calculateBGColor(isChassis, headerColor, techLevel)

  const opacityValue = disabled || dimmed ? 0.5 : 1

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

  const headerCursorStyle =
    !showSelectButton && onClick && !disabled ? 'pointer' : collapsible ? 'pointer' : 'default'

  // Build left content (expand icon + level)
  const leftContentElement = (
    <>
      {techLevel && <StatDisplay label="TL" value={techLevel} compact={compact} />}
      {level && <StatDisplay label="LVL" value={level} compact={compact} />}
    </>
  )

  // Build title content (header + details)
  const subTitleContentElement = header ? (
    <DetailsList data={data} schemaName={schemaName} compact={compact} />
  ) : undefined

  // Build right content (description + stats + collapsible indicator)
  const rightContentElement = (
    <Flex alignItems="center" gap={2} alignSelf="center" maxW="50%" mt={2}>
      {description && headerDescription && (
        <Text
          color="su.white"
          fontStyle="italic"
          textAlign="right"
          fontWeight="medium"
          fontSize="2xs"
          flex="1"
        >
          {description}
        </Text>
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
      headerCursor={headerCursorStyle}
      headerTestId="frame-header-container"
      label={label}
    >
      {(!collapsible || isExpanded) && (
        <Flex bg={backgroundColor} w="full" borderTopRightRadius="2xl" borderTopLeftRadius="2xl">
          {/* Sidebar */}
          {!compact && sidebar.showSidebar && (sidebar.slotsRequired || sidebar.salvageValue) && (
            <VStack
              alignItems="center"
              justifyContent="flex-start"
              pb={3}
              gap={2}
              minW={'80px'}
              maxW={'80px'}
              bg={backgroundColor}
              borderBottomLeftRadius="2xl"
              overflow="visible"
              opacity={opacityValue}
            >
              {sidebar.slotsRequired && (
                <StatDisplay label="Slots" value={sidebar.slotsRequired} compact={compact} />
              )}
              {sidebar.salvageValue && (
                <StatDisplay label="SV" value={sidebar.salvageValue} compact={compact} />
              )}
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
            overflow="visible"
            minW="0"
            borderBottomRightRadius="2xl"
          >
            <Box opacity={opacityValue}>
              {compact && stats.length > 0 && (
                <Box ml="auto">
                  <StatList stats={stats} compact={compact} />
                </Box>
              )}
              {compact &&
                sidebar.showSidebar &&
                (sidebar.slotsRequired || sidebar.salvageValue) && (
                  <Flex
                    alignItems="center"
                    flexDirection="row"
                    justifyContent="flex-end"
                    pb={2}
                    pt={2}
                    gap={2}
                    overflow="visible"
                  >
                    {sidebar.slotsRequired && (
                      <StatDisplay label="Slots" value={sidebar.slotsRequired} compact={compact} />
                    )}
                    {sidebar.salvageValue && (
                      <StatDisplay label="SV" value={sidebar.salvageValue} compact={compact} />
                    )}
                  </Flex>
                )}

              {notes && (
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
                  {notes}
                </Text>
              )}
              {description && !headerDescription && (
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
                  {description}
                </Text>
              )}
              {/* Stat Bonus (for Systems/Modules/Equipment) */}
              {sections.showStatBonus && 'statBonus' in data && data.statBonus && (
                <Box borderRadius="xl">
                  <StatBonusDisplay bonus={data.statBonus.bonus} stat={data.statBonus.stat} />
                </Box>
              )}
              {/* Actions (for Systems/Modules/Equipment) */}
              {sections.showActions &&
                'actions' in data &&
                data.actions &&
                data.actions.length > 0 && (
                  <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="xl">
                    {data.actions.map((action, index) => (
                      <ActionCard
                        key={index}
                        action={action}
                        activationCurrency={activationCurrency}
                      />
                    ))}
                  </VStack>
                )}
              {/* Roll Table (for Systems/Modules/Equipment) */}
              {sections.showRollTable && 'table' in data && data.table && (
                <Box borderRadius="xl" position="relative" zIndex={10}>
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
                  <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="xl">
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
                        borderWidth="1px"
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
                <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="xl">
                  <Heading
                    level="h3"
                    fontSize={compact ? 'md' : 'lg'}
                    fontWeight="bold"
                    color="su.black"
                    textTransform="uppercase"
                  >
                    Abilities
                  </Heading>
                  {abilities.map((ability, index) => (
                    <ActionCard key={index} action={ability} headerBgColor={actionHeaderBgColor} />
                  ))}
                  {techLevelEffects.map((tle, index) => (
                    <SheetDisplay
                      key={index}
                      label={`Tech Level ${tle.techLevelMin}`}
                      value={tle.effect}
                    />
                  ))}
                </VStack>
              )}
              <Box mt="3">{children}</Box>
            </Box>
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
                aria-label="Remove"
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
