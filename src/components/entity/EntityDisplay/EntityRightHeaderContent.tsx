import { Flex } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import { isAbility } from 'salvageunion-reference'
import { EntityStats } from './EntityStats'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityRightHeaderContent({
  rightLabel,
  collapsible,
  isExpanded,
}: {
  isExpanded: boolean
  collapsible: boolean
  rightLabel?: string
}) {
  const { data, compact, fontSize } = useEntityDisplayContext()
  const description = 'description' in data ? data.description : undefined

  const abilityContent = description && isAbility(data) && (
    <Text
      color="su.white"
      fontStyle="italic"
      textAlign="right"
      fontWeight="medium"
      maxH="60px"
      minW="0"
      fontSize={fontSize.xs}
      flexShrink="1"
      whiteSpace="normal"
      lineHeight="shorter"
      maxW={compact ? '175px' : undefined}
      flexWrap="wrap"
      overflow="hidden"
    >
      {description}
    </Text>
  )

  return (
    <Flex>
      {abilityContent}
      <EntityStats data={data} />
      {rightLabel && (
        <Text
          variant="pseudoheader"
          fontSize="lg"
          flexShrink={1}
          textAlign="right"
          overflow="hidden"
          flexWrap="wrap"
        >
          {rightLabel}
        </Text>
      )}
      {collapsible && (
        <Flex
          alignItems="center"
          justifyContent="center"
          minW="25px"
          alignSelf="center"
          flexShrink={0}
        >
          <Text color="su.white" fontSize="lg">
            {isExpanded ? '▼' : '▶'}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
