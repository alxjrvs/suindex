import { Flex, VStack } from '@chakra-ui/react'
import { EntityActions } from './EntityActions'
import { EntityImage } from './EntityImage'
import { Text } from '../../base/Text'
import { hasActions } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityTopMatter({ hideActions }: { hideActions: boolean }) {
  const { data, schemaName, spacing, fontSize } = useEntityDisplayContext()
  const notes = 'notes' in data ? data.notes : undefined
  const description = 'description' in data ? data.description : undefined
  const showDescription = description && schemaName !== 'abilities'
  const hasContent = !!notes || !!showDescription || (hasActions(data) && data.actions.length > 0)
  if (!hasContent) {
    return null
  }

  return (
    <Flex gap={spacing.smallGap} p={spacing.contentPadding} alignItems="flex-start">
      <EntityImage />
      <VStack
        justifyContent="space-between"
        flex="1"
        gap={spacing.contentPadding}
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
            fontSize={fontSize.sm}
          >
            {description}
          </Text>
        )}
        {!hideActions && <EntityActions />}
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
            fontSize={fontSize.sm}
          >
            {notes}
          </Text>
        )}
      </VStack>
    </Flex>
  )
}
