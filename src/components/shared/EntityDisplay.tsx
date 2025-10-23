import { useState, type ReactNode } from 'react'
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { DetailsList } from './DetailsList'
import { StatDisplay } from '../StatDisplay'
import { StatList } from './StatList'
import { ActionCard } from './ActionCard'
import { PageReferenceDisplay } from './PageReferenceDisplay'
import { StatBonusDisplay } from './StatBonusDisplay'
import { RollTable } from './RollTable'
import { techLevelColors } from '../../theme'
import {
  type EntityData,
  detectEntityType,
  getSchemaName,
  getActivationCurrency,
  extractHeaderStats,
  extractDetails,
  extractSidebarData,
  extractContentSections,
  extractHeader,
  extractLevel,
  extractDescription,
  extractNotes,
  extractPageReference,
} from './entityDisplayHelpers'

interface EntityDisplayProps {
  data: EntityData
  headerColor?: string
  actionHeaderBgColor?: string
  actionHeaderTextColor?: string
  children?: ReactNode
  // LiveSheet props (available for all entities, not exclusive to any schema)
  onClick?: () => void
  dimmed?: boolean
  showRemoveButton?: boolean
  disableRemove?: boolean
  onRemove?: () => void
  collapsible?: boolean
  defaultExpanded?: boolean
  expanded?: boolean
  onToggleExpanded?: () => void
  showSelectButton?: boolean
  selectButtonText?: string
  contentJustify?: 'flex-start' | 'flex-end' | 'space-between' | 'stretch'
}

export function EntityDisplay({
  data,
  headerColor,
  actionHeaderBgColor,
  actionHeaderTextColor,
  children,
  onClick,
  dimmed = false,
  showRemoveButton = false,
  disableRemove = false,
  onRemove,
  collapsible = false,
  defaultExpanded = true,
  expanded,
  onToggleExpanded,
  showSelectButton = false,
  selectButtonText,
  contentJustify = 'flex-start',
}: EntityDisplayProps) {
  // Detect entity type and extract all data using helpers
  const entityType = detectEntityType(data)
  const schemaName = getSchemaName(entityType)
  const activationCurrency = getActivationCurrency(entityType)

  const header = extractHeader(data, entityType)
  const level = extractLevel(data)
  const description = extractDescription(data)
  const notes = extractNotes(data)
  const stats = extractHeaderStats(data)
  const details = extractDetails(data, entityType)
  const sidebar = extractSidebarData(data)
  const sections = extractContentSections(data)
  const pageRef = extractPageReference(data)

  // Expansion state management (from Frame)
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const isExpanded = expanded !== undefined ? expanded : internalExpanded
  const handleToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  // Styling (from Frame)
  const backgroundColor =
    headerColor || (sidebar.techLevel ? techLevelColors[sidebar.techLevel] : 'su.orange')
  const opacityValue = dimmed ? 0.5 : 1

  // Click handling (from Frame)
  const handleClick = () => {
    if (showSelectButton) {
      if (collapsible) {
        handleToggle()
      }
    } else {
      if (onClick && !dimmed) {
        onClick()
      } else if (collapsible) {
        handleToggle()
      }
    }
  }

  const cursorStyle =
    !showSelectButton && onClick && !dimmed ? 'pointer' : collapsible ? 'pointer' : 'default'

  return (
    <Box
      bg="su.lightBlue"
      w="full"
      borderRadius="lg"
      shadow="lg"
      overflow="visible"
      opacity={opacityValue}
      cursor={cursorStyle}
      onClick={handleClick}
    >
      {/* Header */}
      <Box p={3} zIndex={10} bg={backgroundColor} overflow="visible">
        <Flex alignItems="flex-start" gap={3} overflow="visible">
          {/* Expand/Collapse Icon */}
          {collapsible && (
            <Flex alignItems="center" justifyContent="center" minW="25px">
              <Text color="su.white" fontSize="lg">
                {isExpanded ? '▼' : '▶'}
              </Text>
            </Flex>
          )}

          {/* Level indicator */}
          {level && (
            <Flex alignItems="center" justifyContent="center" minW="35px" maxW="35px">
              <Text color="su.white" fontSize="2xl" fontWeight="bold">
                {level}
              </Text>
            </Flex>
          )}

          <Box flex="1" overflow="visible" data-testid="frame-header-container">
            <Flex justifyContent="space-between" alignItems="flex-start" overflow="visible">
              {/* Left side: Title and details */}
              <VStack alignItems="flex-start" gap={1} flex="1">
                {header && (
                  <Heading level="h3" flexWrap="wrap" color="su.white">
                    {header}
                  </Heading>
                )}
                {details && details.length > 0 && (
                  <Box>
                    <DetailsList textColor="su.white" values={details} />
                  </Box>
                )}
              </VStack>

              {/* Right side: Stats and remove button */}
              <Flex alignItems="center" gap={2}>
                {stats.length > 0 && (
                  <Box ml="auto">
                    <StatList stats={stats} />
                  </Box>
                )}
                {showRemoveButton && onRemove && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (disableRemove) return

                      const confirmed = window.confirm(
                        `Are you sure you want to remove "${header}"?\n\nThis will cost 1 TP.`
                      )

                      if (confirmed) {
                        onRemove()
                      }
                    }}
                    disabled={disableRemove}
                    bg="su.brick"
                    color="su.white"
                    px={3}
                    py={1}
                    borderRadius="md"
                    fontWeight="bold"
                    _hover={{ bg: 'su.black' }}
                    fontSize="sm"
                    _disabled={{
                      opacity: 0.5,
                      cursor: 'not-allowed',
                      _hover: { bg: 'su.brick' },
                    }}
                    aria-label="Remove ability"
                  >
                    ✕
                  </Button>
                )}
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Box>

      {/* Body with sidebar and content */}
      <Flex bg={backgroundColor}>
        {/* Sidebar */}
        {sidebar.showSidebar &&
          (sidebar.techLevel || sidebar.slotsRequired || sidebar.salvageValue) && (
            <VStack
              alignItems="center"
              justifyContent="flex-start"
              pb={3}
              pt={3}
              gap={3}
              minW="80px"
              maxW="80px"
              bg={backgroundColor}
              overflow="visible"
            >
              {sidebar.slotsRequired && <StatDisplay label="Slots" value={sidebar.slotsRequired} />}
              {sidebar.salvageValue && <StatDisplay label="SV" value={sidebar.salvageValue} />}
              {sidebar.techLevel && <StatDisplay label="TL" value={sidebar.techLevel} />}
            </VStack>
          )}

        {/* Main content area */}
        {(!collapsible || isExpanded) && (
          <VStack
            flex="1"
            bg="su.lightBlue"
            p={3}
            gap={6}
            alignItems="stretch"
            justifyContent={contentJustify}
          >
            {/* Description */}
            {description && (
              <Text color="su.black" fontWeight="medium" lineHeight="relaxed">
                {description}
              </Text>
            )}

            {/* Notes */}
            {notes && (
              <Text color="su.black" fontWeight="medium" lineHeight="relaxed" fontStyle="italic">
                {notes}
              </Text>
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
                <VStack gap={3} alignItems="stretch">
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
              <RollTable table={data.table} showCommand />
            )}

            {/* Systems (for Vehicles and Drones) */}
            {sections.showSystems &&
              'systems' in data &&
              data.systems &&
              data.systems.length > 0 && (
                <VStack gap={3} alignItems="stretch">
                  <Heading level="h3" fontSize="lg" fontWeight="bold" color="su.brick">
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
                      p={3}
                    >
                      <Text fontWeight="bold" color="su.black">
                        {system}
                      </Text>
                    </VStack>
                  ))}
                </VStack>
              )}

            {/* Abilities (for Creatures, BioTitans, NPCs, Squads, Melds, Crawlers) */}
            {sections.showAbilities &&
              'abilities' in data &&
              data.abilities &&
              data.abilities.length > 0 && (
                <VStack gap={3} alignItems="stretch">
                  <Heading
                    level="h3"
                    fontSize="lg"
                    fontWeight="bold"
                    color="su.black"
                    textTransform="uppercase"
                  >
                    Abilities
                  </Heading>
                  {data.abilities.map((ability, index) => (
                    <ActionCard
                      key={index}
                      action={ability}
                      headerBgColor={actionHeaderBgColor}
                      headerTextColor={actionHeaderTextColor}
                    />
                  ))}
                </VStack>
              )}

            {/* Custom children (for special cases like AbilityTreeRequirement, AbilityDisplay, etc.) */}
            {children}

            {/* Spacer before page reference */}
            {pageRef && <Box flex="1" minHeight="1rem" />}

            {/* Page Reference */}
            {pageRef && (
              <PageReferenceDisplay
                source={pageRef.source}
                page={pageRef.page}
                schemaName={schemaName}
              />
            )}

            {/* Select Button - Only shown in modal */}
            {showSelectButton && onClick && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!dimmed) {
                    onClick()
                  }
                }}
                disabled={dimmed}
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
          </VStack>
        )}
      </Flex>
    </Box>
  )
}
