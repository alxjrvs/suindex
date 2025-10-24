import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { ActivationCostBox } from './ActivationCostBox'
import { DetailsList } from './DetailsList'
import type { ReactNode } from 'react'
import type { DataValue } from '../../types/common'
import { formatTraits } from '../../utils/displayUtils'
import type { SURefActionMetaList } from 'salvageunion-reference'

interface ActionCardProps {
  action: SURefActionMetaList
  activationCurrency?: string
  headerBgColor?: string
  headerTextColor?: string
}

export function ActionCard({
  action,
  activationCurrency = 'AP',
  headerBgColor = 'su.lightBlue',
  headerTextColor = 'su.black',
}: ActionCardProps) {
  const description =
    'description' in action && action.description
      ? action.description.replaceAll('•', '\n•')
      : undefined

  // Build details array for DetailsList
  const buildDetailsArray = (): DataValue[] => {
    const details: DataValue[] = []

    if ('damage' in action && action.damage) {
      details.push({ value: `${action.damage.amount}${action.damage.type}` })
    }
    if ('range' in action && action.range) {
      details.push({ value: `Range: ${action.range}` })
    }
    if ('actionType' in action && action.actionType) {
      details.push({ value: action.actionType })
    }
    if ('traits' in action && action.traits && action.traits.length > 0) {
      const formattedTraits = formatTraits(action.traits).join(', ')
      details.push({ value: formattedTraits })
    }

    return details
  }

  const itemDetailsElement: ReactNode = (
    <DetailsList values={buildDetailsArray()} textColor={headerTextColor} />
  )

  const descriptionElement: ReactNode = description ? (
    <Text color="su.black" whiteSpace="pre-line">
      {description}
    </Text>
  ) : null

  const optionsElement: ReactNode =
    'options' in action &&
    action.options &&
    Array.isArray(action.options) &&
    action.options.length > 0 ? (
      <VStack gap={1} ml={4} alignItems="stretch">
        {action.options.map((option, index) => (
          <Box key={index} color="su.black">
            • {option}
          </Box>
        ))}
      </VStack>
    ) : null

  const subAbilitiesElement: ReactNode =
    'subAbilities' in action &&
    action.subAbilities &&
    Array.isArray(action.subAbilities) &&
    action.subAbilities.length > 0 ? (
      <VStack
        gap={2}
        mt={2}
        borderTopWidth="2px"
        borderTopColor="su.black"
        pt={2}
        alignItems="stretch"
      >
        {action.subAbilities.map((subAbility, index) => (
          <Box key={index} ml={2}>
            <Flex alignItems="center" gap={2} flexWrap="wrap">
              <Text as="span" fontWeight="bold" color="su.black">
                {subAbility.name}
              </Text>
              {subAbility.activationCost && (
                <ActivationCostBox cost={subAbility.activationCost} currency={activationCurrency} />
              )}
              {subAbility.actionType && (
                <Text as="span" fontSize="sm" color="su.brick">
                  ({subAbility.actionType})
                </Text>
              )}
            </Flex>
            <DetailsList
              values={(() => {
                const details: DataValue[] = []
                if ('damage' in subAbility && subAbility.damage) {
                  details.push({ value: `${subAbility.damage.amount}${subAbility.damage.type}` })
                }
                if ('range' in subAbility && subAbility.range) {
                  details.push({ value: `Range: ${subAbility.range}` })
                }
                if ('traits' in subAbility && subAbility.traits && subAbility.traits.length > 0) {
                  const formattedTraits = formatTraits(subAbility.traits).join(', ')
                  details.push({ value: formattedTraits })
                }
                return details
              })()}
              textColor="su.black"
            />
            {subAbility.description && (
              <Text fontSize="sm" color="su.black" mt={1}>
                {subAbility.description}
              </Text>
            )}
          </Box>
        ))}
      </VStack>
    ) : null

  const notesElement: ReactNode =
    'notes' in action && action.notes && typeof action.notes === 'string' ? (
      <Text fontSize="sm" color="su.black" fontStyle="italic" mt={2}>
        {action.notes}
      </Text>
    ) : null

  const hasContent = descriptionElement || optionsElement || subAbilitiesElement || notesElement

  return (
    <VStack borderWidth="2px" borderColor="su.black" bg="su.white" gap={0} alignItems="stretch">
      {/* Header */}
      {'name' in action && action.name && (
        <Box bg={headerBgColor || 'su.lightBlue'} px={3} py={2}>
          <Flex alignItems="center" gap={2} justifyContent="space-between">
            <Flex alignItems="center" gap={2}>
              {'activationCost' in action && action.activationCost && (
                <ActivationCostBox cost={action.activationCost} currency={activationCurrency} />
              )}
              <Text
                as="span"
                fontWeight="bold"
                color={headerTextColor || 'su.white'}
                fontSize="17px"
              >
                {action.name}
              </Text>
            </Flex>
            {itemDetailsElement}
          </Flex>
        </Box>
      )}

      {/* Content - only render if there's content to show */}
      {hasContent && (
        <Box p={3}>
          <VStack gap={2} alignItems="stretch">
            {descriptionElement}
            {optionsElement}
            {subAbilitiesElement}
            {notesElement}
          </VStack>
        </Box>
      )}
    </VStack>
  )
}
