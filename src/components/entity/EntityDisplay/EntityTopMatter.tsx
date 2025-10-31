import { Box, Flex, VStack } from '@chakra-ui/react'
import { EntityActions } from './EntityActions'
import { EntityImage } from './EntityImage'
import type { EntityDisplaySubProps } from './types'
import { StatList } from './EntityStatList'
import { Text } from '../../base/Text'

export function EntityTopMatter({
  data,
  schemaName,
  hideActions,
  compact,
}: EntityDisplaySubProps & { hideActions: boolean }) {
  const notes = 'notes' in data ? data.notes : undefined
  const description = 'description' in data ? data.description : undefined
  const hasActions = 'actions' in data && data.actions && data.actions.length > 0
  const showDescription = description && schemaName !== 'abilities'
  const hasStats = compact && 'stats' in data && data.stats

  if (!notes && !showDescription && !hasActions && !hasStats) {
    return null
  }

  return (
    <Flex gap={compact ? 2 : 3} alignItems="flex-start">
      <EntityImage data={data} schemaName={schemaName} compact={compact} />
      <VStack
        justifyContent="space-around"
        flex="1"
        gap={compact ? 2 : 3}
        alignItems="stretch"
        h="full"
        minW="0"
      >
        <Box ml="auto">
          <StatList schemaName={schemaName} header={false} data={data} compact={compact} />
        </Box>
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
