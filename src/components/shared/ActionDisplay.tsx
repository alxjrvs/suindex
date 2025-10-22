import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { DataList } from './DataList'
import { ActivationCostBox } from './ActivationCostBox'
import { ItemDetailsDisplay } from './ItemDetailsDisplay'
import type { DataValue } from '../../types/common'
import type { ReactNode } from 'react'
import type { Action } from '../types'

interface ActionDisplayProps {
  action: Action
  activationCurrency?: string
}

function generateDataListValues(action: Action): DataValue[] {
  const details: DataValue[] = []

  if ('range' in action && action.range) {
    details.push({ value: action.range })
  }

  if ('actionType' in action && action.actionType) {
    details.push({ value: action.actionType })
  }

  return details
}

export function ActionDisplay({ action, activationCurrency = 'AP' }: ActionDisplayProps) {
  // Check if this is a sub-ability (has damage, range, or traits but no activationCost or actionType at top level)
  const isSubAbility = 'damage' in action || ('range' in action && !('activationCost' in action))

  const dataListValues = generateDataListValues(action)
  const description =
    'description' in action && action.description
      ? action.description.replaceAll('•', '\n•')
      : undefined

  // Skip dataList for sub-abilities since ItemDetailsDisplay shows all details
  const dataList: ReactNode =
    !isSubAbility && dataListValues.length > 0 ? (
      <Box>
        <DataList values={dataListValues} />
      </Box>
    ) : null

  const itemDetailsElement: ReactNode = (
    <ItemDetailsDisplay
      damage={'damage' in action ? action.damage : undefined}
      range={'range' in action ? action.range : undefined}
      actionType={'actionType' in action ? action.actionType : undefined}
      traits={'traits' in action ? action.traits : undefined}
      compact
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
              compact
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
    <VStack
      borderWidth="2px"
      borderColor="su.black"
      bg="su.white"
      p={3}
      gap={2}
      alignItems="stretch"
    >
      <Flex alignItems="center" gap={1}>
        {'activationCost' in action && action.activationCost && (
          <ActivationCostBox cost={action.activationCost} currency={activationCurrency} />
        )}
        {'name' in action && action.name && (
          <Text as="span" fontWeight="bold" color="su.black" fontSize="17px">
            {action.name}
          </Text>
        )}
      </Flex>

      {dataList}
      {itemDetailsElement}
      {descriptionElement}
      {optionsElement}
      {subAbilitiesElement}
      {notesElement}
    </VStack>
  )
}
