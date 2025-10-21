import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Frame } from './shared/Frame'
import { ActionDisplay } from './shared/ActionDisplay'
import type { Ability } from 'salvageunion-reference'
import type { DataValue } from '../types/common'

interface AbilityDisplayProps {
  data: Ability
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
  const details = generateAbilityDetails(data)
  const isLegendary = String(data.level).toUpperCase() === 'L' || data.tree.includes('Legendary')
  const headerColor = isLegendary ? 'var(--color-su-pink)' : 'var(--color-su-orange)'

  return (
    <Frame
      header={data.name}
      level={data.level}
      headerColor={headerColor}
      details={details}
      notes={'notes' in data && typeof data.notes === 'string' ? data.notes : undefined}
      showSidebar={false}
      onClick={onClick}
      dimmed={dimmed}
      showRemoveButton={showRemoveButton}
      disableRemove={disableRemove}
      onRemove={onRemove}
      collapsible={collapsible}
      defaultExpanded={defaultExpanded}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      showSelectButton={showSelectButton}
      selectButtonCost={selectButtonCost}
    >
      <AbilityContent data={data} />
    </Frame>
  )
}
