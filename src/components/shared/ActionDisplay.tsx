import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { ActivationCostBox } from './ActivationCostBox'
import { ItemDetailsDisplay } from './ItemDetailsDisplay'
import type { ReactNode } from 'react'
import type { Action } from '../types'

interface ActionDisplayProps {
  action: Action
  activationCurrency?: string
  headerBgColor?: string
  headerTextColor?: string
}

export function ActionDisplay({
  action,
  activationCurrency = 'AP',
  headerBgColor = 'su.lightBlue',
  headerTextColor = 'su.black',
}: ActionDisplayProps) {
  const description =
    'description' in action && action.description
      ? action.description.replaceAll('•', '\n•')
      : undefined

  // Only show ItemDetailsDisplay if there's damage or traits (range/actionType already in dataList)
  const itemDetailsElement: ReactNode = (
    <ItemDetailsDisplay
      damage={'damage' in action ? action.damage : undefined}
      range={'range' in action ? action.range : undefined}
      actionType={'actionType' in action ? action.actionType : undefined}
      traits={'traits' in action ? action.traits : undefined}
    />
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
            <ItemDetailsDisplay
              damage={'damage' in subAbility ? subAbility.damage : undefined}
              range={'range' in subAbility ? subAbility.range : undefined}
              actionType={undefined}
              traits={'traits' in subAbility ? subAbility.traits : undefined}
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

  return (
    <VStack borderWidth="2px" borderColor="su.black" bg="su.white" gap={0} alignItems="stretch">
      {/* Header */}
      {'name' in action && action.name && (
        <Box bg={headerBgColor || 'su.lightBlue'} px={3} py={2}>
          <Flex alignItems="center" gap={2}>
            {'activationCost' in action && action.activationCost && (
              <ActivationCostBox cost={action.activationCost} currency={activationCurrency} />
            )}
            <Text as="span" fontWeight="bold" color={headerTextColor || 'su.white'} fontSize="17px">
              {action.name}
            </Text>
          </Flex>
        </Box>
      )}

      {/* Content */}
      <Box p={3}>
        <VStack gap={2} alignItems="stretch">
          {itemDetailsElement}
          {descriptionElement}
          {optionsElement}
          {subAbilitiesElement}
          {notesElement}
        </VStack>
      </Box>
    </VStack>
  )
}
