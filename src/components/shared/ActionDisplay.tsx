import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { DataList } from './DataList'
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
  const dataListValues = generateDataListValues(action)
  const description =
    'description' in action && action.description
      ? action.description.replaceAll('•', '\n•')
      : undefined

  const dataList: ReactNode =
    dataListValues.length > 0 ? (
      <Box>
        <DataList values={dataListValues} />
      </Box>
    ) : null

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
            <Flex alignItems="center" gap={2}>
              <Text as="span" fontWeight="bold" color="su.black">
                {subAbility.name}
              </Text>
              {subAbility.actionType && (
                <Text as="span" fontSize="sm" color="su.brick">
                  ({subAbility.actionType})
                </Text>
              )}
              {subAbility.activationCost && (
                <Text as="span" fontSize="sm" color="su.brick">
                  {subAbility.activationCost} AP
                </Text>
              )}
            </Flex>
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
          <Flex alignItems="center" overflow="visible">
            <Flex
              bg="su.black"
              color="su.white"
              fontWeight="bold"
              textTransform="uppercase"
              alignItems="center"
              justifyContent="center"
              whiteSpace="nowrap"
              fontSize="15px"
              px="6px"
              py="2px"
              h="20px"
              minW="50px"
              zIndex={2}
            >
              {`${action.activationCost === 'Variable' ? 'X' : action.activationCost} ${activationCurrency}`}
            </Flex>
            <Box
              w={0}
              h={0}
              borderTop="10px solid transparent"
              borderBottom="10px solid transparent"
              borderLeft="10px solid"
              borderLeftColor="su.black"
              ml={0}
              zIndex={1}
            />
          </Flex>
        )}
        {'name' in action && action.name && (
          <Text as="span" fontWeight="bold" color="su.black" fontSize="17px">
            {action.name}
          </Text>
        )}
      </Flex>

      {dataList}
      {descriptionElement}
      {optionsElement}
      {subAbilitiesElement}
      {notesElement}
    </VStack>
  )
}
