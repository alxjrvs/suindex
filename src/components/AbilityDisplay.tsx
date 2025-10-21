import { useState } from 'react'
import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Frame } from './shared/Frame'
import { ActionDisplay } from './shared/ActionDisplay'
import type { Ability } from 'salvageunion-reference'
import type { DataValue } from '../types/common'

interface AbilityDisplayProps {
  data: Ability
  compact?: boolean
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
}

function generateAbilityDetails(ability: Ability): DataValue[] {
  const details: DataValue[] = []

  if (ability.activationCost) {
    const costValue =
      ability.activationCost === 'Variable' ? 'Variable AP' : `${ability.activationCost} AP`
    details.push({ value: costValue, cost: true })
  }

  if (ability.range) {
    details.push({ value: ability.range })
  }

  if (ability.actionType) {
    details.push({ value: ability.actionType })
  }

  return details
}

function AbilityContent({ data }: { data: Ability }) {
  return (
    <VStack gap={4} alignItems="stretch">
      {data.description && (
        <Box>
          <Heading as="h4" fontWeight="bold" color="su.black" mb={2} fontSize="md">
            Description:
          </Heading>
          <Text color="su.black" lineHeight="relaxed">
            {data.description}
          </Text>
        </Box>
      )}

      {data.effect && (
        <Box>
          <Heading as="h4" fontWeight="bold" color="su.black" mb={2} fontSize="md">
            Effect:
          </Heading>
          <Text color="su.black" lineHeight="relaxed" whiteSpace="pre-line">
            {data.effect}
          </Text>
        </Box>
      )}

      {data.subAbilities && data.subAbilities.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          <Heading as="h4" fontWeight="bold" color="su.black" mb={2} fontSize="md">
            Sub-Abilities:
          </Heading>
          {data.subAbilities.map((subAbility, index) => (
            <ActionDisplay key={index} action={subAbility} activationCurrency="AP" />
          ))}
        </VStack>
      )}

      <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
        <Flex alignItems="center" gap={2}>
          <Text as="span" fontWeight="bold" color="su.brick">
            Tree:
          </Text>
          <Text as="span" color="su.black">
            {data.tree}
          </Text>
        </Flex>
        <Flex alignItems="center" gap={2} mt={1}>
          <Text as="span" fontWeight="bold" color="su.brick">
            Source:
          </Text>
          <Text as="span" color="su.black" textTransform="capitalize">
            {data.source}
          </Text>
        </Flex>
        <Flex alignItems="center" gap={2} mt={1}>
          <Text as="span" fontWeight="bold" color="su.brick">
            Page:
          </Text>
          <Text as="span" color="su.black">
            {data.page}
          </Text>
        </Flex>
      </Box>
    </VStack>
  )
}

export function AbilityDisplay({
  data,
  compact = false,
  onClick,
  dimmed = false,
  showRemoveButton = false,
  disableRemove = false,
  onRemove,
  collapsible = false,
  defaultExpanded = false,
  expanded,
  onToggleExpanded,
  showSelectButton = false,
  selectButtonCost,
}: AbilityDisplayProps) {
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

  const details = generateAbilityDetails(data)
  const isLegendary = String(data.level).toUpperCase() === 'L' || data.tree.includes('Legendary')
  const headerColor = isLegendary ? 'var(--color-su-pink)' : 'var(--color-su-orange)'

  // Full-page mode with Frame
  if (!compact) {
    return (
      <Frame
        header={data.name}
        level={data.level}
        headerColor={headerColor}
        details={details}
        notes={'notes' in data && typeof data.notes === 'string' ? data.notes : undefined}
        showSidebar={false}
      >
        <AbilityContent data={data} />
      </Frame>
    )
  }

  // Compact mode for selector/list
  // Handler for clicking on the component (only for toggle when showSelectButton is false)
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

  return (
    <Box
      w="full"
      borderWidth="2px"
      borderColor="su.black"
      bg="su.white"
      opacity={dimmed ? 0.5 : 1}
      _hover={dimmed ? {} : { opacity: 1 }}
      position={showRemoveButton ? 'relative' : undefined}
      cursor={
        !showSelectButton && onClick && !dimmed ? 'pointer' : collapsible ? 'pointer' : undefined
      }
      onClick={handleClick}
    >
      {/* Header */}
      <Flex
        color="su.white"
        px={3}
        py={2}
        fontWeight="bold"
        textTransform="uppercase"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        bg={headerColor}
      >
        {/* Expand/Collapse Icon */}
        {collapsible && (
          <Text as="span" color="su.white" fontSize="lg">
            {isExpanded ? '▼' : '▶'}
          </Text>
        )}

        <Text
          as="span"
          bg="su.white"
          color="su.black"
          fontWeight="bold"
          px={2}
          py={1}
          borderRadius="md"
          minW="30px"
          textAlign="center"
        >
          {data.level}
        </Text>
        <Text as="span" flex="1">
          {data.name}
        </Text>

        {data.activationCost && (
          <Flex alignItems="center" overflow="visible">
            <Box
              bg="su.black"
              color="su.white"
              fontWeight="bold"
              textTransform="uppercase"
              display="flex"
              alignItems="center"
              justifyContent="center"
              whiteSpace="nowrap"
              fontSize="13px"
              pl="6px"
              pr="6px"
              pt="2px"
              pb="2px"
              h="20px"
              minW="50px"
              zIndex={2}
            >
              {data.activationCost === 'Variable' ? 'X AP' : `${data.activationCost} AP`}
            </Box>
            <Box
              w={0}
              h={0}
              borderTop="10px solid transparent"
              borderBottom="10px solid transparent"
              borderLeft="10px solid var(--color-su-black)"
              ml={0}
              zIndex={1}
            />
          </Flex>
        )}

        {/* Tags in header */}
        {data.range && (
          <Text
            as="span"
            bg="su.white"
            color="su.black"
            px={2}
            py={1}
            borderRadius="md"
            fontSize="xs"
            fontWeight="bold"
          >
            {data.range}
          </Text>
        )}
        {data.actionType && (
          <Text
            as="span"
            bg="su.white"
            color="su.black"
            px={2}
            py={1}
            borderRadius="md"
            fontSize="xs"
            fontWeight="bold"
          >
            {data.actionType}
          </Text>
        )}

        {showRemoveButton && onRemove && (
          <Button
            onClick={(e) => {
              e.stopPropagation()
              if (disableRemove) return

              const confirmed = window.confirm(
                `Are you sure you want to remove "${data.name}"?\n\nThis will cost 1 TP.`
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
            _disabled={{ opacity: 0.5, cursor: 'not-allowed', _hover: { bg: 'su.brick' } }}
            aria-label="Remove ability"
          >
            ✕
          </Button>
        )}
      </Flex>

      {(!collapsible || isExpanded) && (
        <VStack gap={2} p={3} alignItems="stretch">
          {data.description && (
            <Box>
              <Text color="su.black" fontSize="sm">
                {data.description}
              </Text>
            </Box>
          )}

          {data.effect && (
            <Box>
              <Text color="su.black" fontSize="sm" lineHeight="relaxed" whiteSpace="pre-line">
                {data.effect}
              </Text>
            </Box>
          )}

          {data.subAbilities && data.subAbilities.length > 0 && (
            <VStack gap={2} pt={2} alignItems="stretch">
              {data.subAbilities.map((subAbility, index) => (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <ActionDisplay key={index} action={subAbility as any} activationCurrency="AP" />
              ))}
            </VStack>
          )}

          {/* Footer - Source, Page */}
          <Box pt={2} borderTopWidth="1px" borderTopColor="su.black" fontSize="xs" color="su.brick">
            <Flex alignItems="center" gap={2}>
              <Text as="span" fontWeight="bold">
                Source:
              </Text>
              <Text as="span" textTransform="capitalize">
                {data.source}
              </Text>
              <Text as="span">•</Text>
              <Text as="span" fontWeight="bold">
                Page:
              </Text>
              <Text as="span">{data.page}</Text>
            </Flex>
          </Box>

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
              _disabled={{ opacity: 0.5, cursor: 'not-allowed', _hover: { bg: 'su.orange' } }}
            >
              Add to Pilot{selectButtonCost !== undefined ? ` (${selectButtonCost} TP)` : ''}
            </Button>
          )}
        </VStack>
      )}
    </Box>
  )
}
