import { useState, type ReactNode } from 'react'
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { DataList } from './DataList'
import { StatDisplay } from '../StatDisplay'
import type { DataValue } from '../../types/common'
import { techLevelColors } from '../../theme'

export interface FrameProps {
  header: string
  headerColor?: string
  headerContent?: ReactNode
  level?: string | number
  techLevel?: number
  details?: DataValue[]
  description?: string
  notes?: string
  children?: ReactNode
  showSidebar?: boolean
  slotsRequired?: number
  salvageValue?: number
  // New props for interactive functionality
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
  selectButtonCost?: number
  contentJustify?: 'flex-start' | 'flex-end' | 'space-between' | 'stretch'
}

export function Frame({
  header,
  headerColor,
  headerContent,
  level,
  techLevel,
  details,
  description,
  notes,
  children,
  showSidebar = true,
  slotsRequired,
  salvageValue,
  onClick,
  dimmed = false,
  contentJustify = 'flex-start',
  showRemoveButton = false,
  disableRemove = false,
  onRemove,
  collapsible = false,
  defaultExpanded = false,
  expanded,
  onToggleExpanded,
  showSelectButton = false,
  selectButtonCost,
}: FrameProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

  // Use controlled expansion if provided, otherwise use internal state
  const isExpanded = expanded !== undefined ? expanded : internalExpanded
  const handleToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  const backgroundColor = headerColor || (techLevel ? techLevelColors[techLevel] : 'su.orange')
  const opacityValue = dimmed ? 0.5 : 1

  // Handler for clicking on the component
  const handleClick = () => {
    if (showSelectButton) {
      // When showSelectButton is true, only toggle on click
      if (collapsible) {
        handleToggle()
      }
    } else {
      // Original behavior: onClick takes precedence, then toggle
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

          {level && (
            <Flex alignItems="center" justifyContent="center" minW="35px" maxW="35px">
              <Text color="su.white" fontSize="2xl" fontWeight="bold">
                {level}
              </Text>
            </Flex>
          )}
          <Box flex="1" overflow="visible">
            <Flex justifyContent="space-between" alignItems="flex-start" overflow="visible">
              {header && (
                <Heading level="h3" maxW="80%" flexWrap="wrap" color="su.white">
                  {header}
                </Heading>
              )}
              <Flex alignItems="center" gap={2}>
                {headerContent}
                {/* Remove Button (moved inside header row so queries using closest('div') include it) */}
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
            <Box minH="15px" mt={1}>
              <DataList textColor="su.white" values={details || []} />
            </Box>
          </Box>
        </Flex>
      </Box>

      <Flex bg={backgroundColor}>
        {showSidebar && (techLevel || slotsRequired || salvageValue) && (
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
            {slotsRequired && <StatDisplay label="Slots" value={slotsRequired} />}
            {salvageValue && <StatDisplay label="SV" value={salvageValue} />}
            {techLevel && <StatDisplay label="TL" value={techLevel} />}
          </VStack>
        )}

        {(!collapsible || isExpanded) && (
          <VStack
            flex="1"
            bg="su.lightBlue"
            p={3}
            gap={6}
            alignItems="stretch"
            justifyContent={contentJustify}
          >
            {description && (
              <Text color="su.black" fontWeight="medium" lineHeight="relaxed">
                {description}
              </Text>
            )}

            {children}

            {notes && (
              <Box borderWidth="1px" borderColor="su.black" p={3} borderRadius="md" bg="su.white">
                <Text color="su.black">{notes}</Text>
              </Box>
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
                Add to Pilot{selectButtonCost !== undefined ? ` (${selectButtonCost} TP)` : ''}
              </Button>
            )}
          </VStack>
        )}
      </Flex>
    </Box>
  )
}
