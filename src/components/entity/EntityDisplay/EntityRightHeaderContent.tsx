import { Flex } from '@chakra-ui/react'
import type { EntityDisplaySubProps } from './types'
import { Text } from '../../base/Text'
import { isAbility } from 'salvageunion-reference'
import { EntityStats } from './EntityStats'

export function EntityRightHeaderContent({
  data,
  compact,
  rightLabel,
  collapsible,
  schemaName,
  isExpanded,
}: EntityDisplaySubProps & { isExpanded: boolean; collapsible: boolean; rightLabel?: string }) {
  const description = 'description' in data ? data.description : undefined

  const abilityContent = description && isAbility(data) && (
    <Text
      color="su.white"
      fontStyle="italic"
      textAlign="right"
      fontWeight="medium"
      maxH="60px"
      minW="0"
      fontSize={compact ? '2xs' : 'sm'}
      flexShrink="1"
      whiteSpace="normal"
      lineHeight="shorter"
      maxW={compact ? '150px' : undefined}
      flexWrap="wrap"
      overflow="hidden"
    >
      {description}
    </Text>
  )

  return (
    <Flex>
      {abilityContent}
      <EntityStats data={data} compact={compact} schemaName={schemaName} />
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
