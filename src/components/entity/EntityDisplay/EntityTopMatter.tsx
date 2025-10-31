import { Flex, VStack } from '@chakra-ui/react'
import { EntityActions } from './EntityActions'
import { EntityImage } from './EntityImage'
import type { EntityDisplaySubProps } from './types'
import { Text } from '../../base/Text'
import { hasActions } from 'salvageunion-reference'

export function EntityTopMatter({
  data,
  schemaName,
  hideActions,
  compact,
}: EntityDisplaySubProps & { hideActions: boolean }) {
  const notes = 'notes' in data ? data.notes : undefined
  const description = 'description' in data ? data.description : undefined
  const showDescription = description && schemaName !== 'abilities'

  if (!notes && !showDescription && !hasActions(data)) {
    return null
  }

  return (
    <Flex gap={compact ? 2 : 3} alignItems="flex-start">
      <EntityImage data={data} schemaName={schemaName} compact={compact} />
      <VStack
        justifyContent="space-between"
        flex="1"
        gap={compact ? 2 : 3}
        alignItems="stretch"
        h="full"
        minW="0"
      >
        {showDescription && (
          <Text
            color="su.black"
            fontWeight="medium"
            lineHeight="relaxed"
            fontStyle="italic"
            wordBreak="break-word"
            overflowWrap="break-word"
            whiteSpace="normal"
            overflow="hidden"
            maxW="100%"
            fontSize={compact ? 'xs' : 'sm'}
          >
            {description}
          </Text>
        )}
        {!hideActions && <EntityActions data={data} compact={compact} schemaName={schemaName} />}
        {notes && (
          <Text
            color="su.black"
            fontWeight="medium"
            lineHeight="relaxed"
            fontStyle="italic"
            wordBreak="break-word"
            overflowWrap="break-word"
            whiteSpace="normal"
            overflow="hidden"
            maxW="100%"
            fontSize={compact ? 'xs' : 'sm'}
          >
            {notes}
          </Text>
        )}
      </VStack>
    </Flex>
  )
}
