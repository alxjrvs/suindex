import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { ActivationCostBox } from './ActivationCostBox'
import { DetailsList } from './DetailsList'
import { RoundedBox } from './RoundedBox'
import type { ReactNode } from 'react'
import type { SURefActionMetaList } from 'salvageunion-reference'

interface ActionCardProps {
  action: SURefActionMetaList
  activationCurrency?: string
  headerBgColor?: string
}

export function ActionCard({
  action,
  activationCurrency = 'AP',
  headerBgColor = 'su.lightBlue',
}: ActionCardProps) {
  const description =
    'description' in action && action.description
      ? action.description.replaceAll('•', '\n•')
      : undefined

  const itemDetailsElement: ReactNode = <DetailsList data={action} />

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
            <DetailsList data={subAbility} />
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

  const leftContentElement =
    'activationCost' in action && action.activationCost ? (
      <ActivationCostBox cost={action.activationCost} currency={activationCurrency} />
    ) : undefined

  return (
    <RoundedBox
      bg={headerBgColor}
      bodyBg="su.white"
      title={'name' in action ? action.name : undefined}
      leftContent={leftContentElement}
      rightContent={itemDetailsElement}
      bodyPadding={hasContent ? 3 : 0}
    >
      {hasContent && (
        <VStack gap={2} alignItems="stretch" w="full">
          {descriptionElement}
          {optionsElement}
          {subAbilitiesElement}
          {notesElement}
        </VStack>
      )}
    </RoundedBox>
  )
}
