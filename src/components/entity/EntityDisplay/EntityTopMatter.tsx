import { Flex, VStack, Box } from '@chakra-ui/react'
import { EntityActions } from './EntityActions'
import { EntityImage } from './EntityImage'
import { hasActions, getDescription } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { useParseTraitReferences } from '../../../utils/parseTraitReferences'

export function EntityTopMatter({ hideActions }: { hideActions: boolean }) {
  const { data, schemaName, spacing, fontSize } = useEntityDisplayContext()
  const notes = 'notes' in data ? data.notes : undefined
  const description = getDescription(data)
  const showDescription = description && schemaName !== 'abilities'
  const hasContent = !!notes || !!showDescription || (hasActions(data) && data.actions.length > 0)

  const parsedDescription = useParseTraitReferences(description)
  const parsedNotes = useParseTraitReferences(notes)

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
          <Box
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
            {parsedDescription}
          </Box>
        )}
        {!hideActions && <EntityActions />}
        {notes && (
          <Box
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
            {parsedNotes}
          </Box>
        )}
      </VStack>
    </Flex>
  )
}
