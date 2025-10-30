import { VStack } from '@chakra-ui/react'
import { Heading } from '../../base/Heading'
import { Text } from '../../base/Text'
import type { EntityDisplaySubProps } from './types'

export function EntitySystemDisplay({ data, compact }: EntityDisplaySubProps) {
  if (!('systems' in data) || !data.systems || data.systems.length === 0) return null

  return (
    <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
      <Heading level="h3" fontSize={compact ? 'md' : 'lg'} fontWeight="bold" color="su.brick">
        Systems
      </Heading>
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
