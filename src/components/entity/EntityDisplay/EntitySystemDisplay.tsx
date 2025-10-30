import { VStack } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import type { EntityDisplaySubProps } from './types'
import { EntitySubheader } from './EntitySubheader'

export function EntitySystemDisplay({ data, compact }: EntityDisplaySubProps) {
  if (!('systems' in data) || !data.systems || data.systems.length === 0) return null

  return (
    <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
      <EntitySubheader compact={compact} label="Systems" />
      {data.systems.map((system, index) => (
        <VStack
          key={index}
          gap={2}
          alignItems="stretch"
          bg="su.white"
          borderWidth="2px"
          borderColor="su.black"
          borderRadius="md"
          p={compact ? 2 : 3}
        >
          <Text fontWeight="bold" color="su.black" fontSize={compact ? 'sm' : 'md'}>
            {system}
          </Text>
        </VStack>
      ))}
    </VStack>
  )
}
