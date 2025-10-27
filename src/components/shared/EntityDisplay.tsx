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
import { RoundedBox } from './RoundedBox'
import { techLevelColors } from '../../theme'
import {
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
  extractTechLevelEffects,
  extractAbilities,
  extractTechLevel,
  schemaNameToEntityName,
  getSchemaName,
} from './entityDisplayHelpers'
import type { SURefEntity, SURefSchemaName } from 'salvageunion-reference'
import { SheetDisplay } from './SheetDisplay'

interface EntityDisplayProps {
  data: SURefEntity
  headerColor?: string
  actionHeaderBgColor?: string
  actionHeaderTextColor?: string
  children?: ReactNode
  onClick?: () => void
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
  schemaName: SURefSchemaName
}

export function EntityDisplay({
  data,
  label,
  headerColor,
  actionHeaderBgColor,
  actionHeaderTextColor,
  children,
  onClick,
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
}: EntityDisplayProps) {
  // Convert schemaName to entityName for helper functions
  const entityName = schemaNameToEntityName(schemaName)

  const variableCost = 'activationCost' in data && schemaName === 'abilities'
  const activationCurrency = getActivationCurrency(entityName, variableCost)

  const header = extractHeader(data, entityName)
  const level = extractLevel(data)
  const description = extractDescription(data)
  const notes = extractNotes(data)
  const stats = extractHeaderStats(data)
  const details = extractDetails(data, entityName)
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
  const headerDescription = !isEquipment && !isModule && !isSystem

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
  const backgroundColor = headerColor || (techLevel ? techLevelColors[techLevel] : 'su.orange')
  const opacityValue = dimmed ? 0.5 : 1

  // Click handling for header only
  const handleHeaderClick = () => {
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

  const headerCursorStyle =
    !showSelectButton && onClick && !dimmed ? 'pointer' : collapsible ? 'pointer' : 'default'

  // Build left content (expand icon + level)
  const leftContentElement = (
    <>
      {techLevel && <StatDisplay label="TL" value={techLevel} />}
      {level && <StatDisplay label="LVL" value={level} />}
    </>
  )

  // Build title content (header + details)
  const subTitleContentElement = header ? (
    <DetailsList textColor="su.white" values={details} />
  ) : undefined

  // Build right content (description + stats + remove button)
  const rightContentElement = (
    <Flex alignItems="center" gap={2} alignSelf="center" maxW="50%" mt={2}>
      {description && headerDescription && (
        <Text
          color="su.white"
          fontStyle="italic"
          textAlign="right"
          fontWeight="medium"
          lineHeight="1.2"
          fontSize="xs"
          flex="1"
        >
          {description}
        </Text>
      )}
      {stats.length > 0 && (
        <Box ml="auto">
          <StatList stats={stats} />
        </Box>
      )}
      {onRemove && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            if (disableRemove) return

            const message =
              removeConfirmMessage ||
              `Are you sure you want to remove "${header}"?\n\nThis will cost 1 TP.`

            const confirmed = window.confirm(message)

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
      bg="su.lightBlue"
      headerBg={backgroundColor}
      w="full"
      opacity={opacityValue}
      leftContent={leftContentElement}
      title={header}
      subTitleContent={subTitleContentElement}
      rightContent={rightContentElement}
      headerPadding={3}
      bodyPadding={0}
      onHeaderClick={handleHeaderClick}
      headerCursor={headerCursorStyle}
      headerTestId="frame-header-container"
      label={label}
    >
      {/* Body with sidebar and content */}
      {(!collapsible || isExpanded) && (
        <Flex bg={backgroundColor} w="full">
          {/* Sidebar */}
          {sidebar.showSidebar && (sidebar.slotsRequired || sidebar.salvageValue) && (
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
            </VStack>
          )}

          {/* Main content area */}
          <VStack
            flex="1"
            bg="su.lightBlue"
            p={3}
            gap={6}
            alignItems="stretch"
            justifyContent={contentJustify}
            overflow="hidden"
            minW="0"
          >
            {/* Notes */}
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
                fontSize="sm"
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
                fontSize="sm"
              >
                {description}
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
              <RollTable
                table={data.table}
                showCommand
                tableName={'name' in data ? String(data.name) : undefined}
              />
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
            {sections.showAbilities && (
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
                {abilities.map((ability, index) => (
                  <ActionCard
                    key={index}
                    action={ability}
                    headerBgColor={actionHeaderBgColor}
                    headerTextColor={actionHeaderTextColor}
                  />
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

            {children}
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

            {/* Page Reference */}
            {pageRef && (
              <PageReferenceDisplay
                source={pageRef.source}
                page={pageRef.page}
                schemaName={getSchemaName(entityName)}
              />
            )}
          </VStack>
        </Flex>
      )}
    </RoundedBox>
  )
}
