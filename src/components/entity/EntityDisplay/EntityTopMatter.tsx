import { Box, Flex, VStack } from '@chakra-ui/react'
import { EntityActions } from './EntityActions'
import { EntityImage } from './EntityImage'
import { ItalicText } from './ItalicText'
import type { EntityDisplaySubProps } from './types'
import { StatList } from './EntityStatList'

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

  // Don't render if there's no content to show
  if (!notes && !showDescription && !hasActions) {
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
          <StatList header={false} data={data} compact={compact} />
        </Box>
        {showDescription && <ItalicText compact={compact}>{description}</ItalicText>}
        {!hideActions && <EntityActions data={data} compact={compact} schemaName={schemaName} />}
        {notes && <ItalicText compact={compact}>{notes}</ItalicText>}
      </VStack>
    </Flex>
  )
}
