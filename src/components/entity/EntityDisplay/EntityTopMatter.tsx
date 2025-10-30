import { Flex, VStack } from '@chakra-ui/react'
import { EntityActions } from './EntityActions'
import { EntityImage } from './EntityImage'
import { ItalicText } from './ItalicText'
import type { EntityDisplaySubProps } from './types'

export function EntityTopMatter({ data, schemaName, compact }: EntityDisplaySubProps) {
  const notes = 'notes' in data ? data.notes : undefined
  const description = 'description' in data ? data.description : undefined
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
        {notes && <ItalicText compact={compact}>{notes}</ItalicText>}
        {description && schemaName !== 'abilities' && (
          <ItalicText compact={compact}>{description}</ItalicText>
        )}

        <EntityActions data={data} compact={compact} schemaName={schemaName} />
      </VStack>
    </Flex>
  )
}
