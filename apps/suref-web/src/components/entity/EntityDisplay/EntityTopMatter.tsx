import { Flex, VStack } from '@chakra-ui/react'
import { EntityActions } from './EntityActions'
import { EntityImage } from './EntityImage'
import { hasActions, extractActions, getChassisAbilities } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { ContentBlockRenderer } from './ContentBlockRenderer'
import { EntityChassisAbilitiesContent } from './EntityChassisAbilitiesContent'

export function EntityTopMatter({ hideActions }: { hideActions: boolean }) {
  const { data, schemaName, spacing, fontSize, compact } = useEntityDisplayContext()

  // Determine which content to render
  let contentBlocks = 'content' in data ? data.content : undefined

  // For single-action entities, use the action's content instead
  const isSingleAction = hasActions(data) && extractActions(data)?.length === 1
  if (isSingleAction) {
    const actions = extractActions(data)
    if (actions && actions.length === 1) {
      contentBlocks = actions[0].content
    }
  }

  // Show content if:
  // 1. Entity has content blocks, OR
  // 2. Entity has a single action (content extracted above)
  // Note: For abilities with single actions, we show the action content inline
  // For abilities with multiple actions, we show them as NestedActionDisplay (handled by EntityActions)
  const showContent = contentBlocks && contentBlocks.length > 0

  const hasChassisAbilities = schemaName === 'chassis' && getChassisAbilities(data)

  const hasContent =
    !!showContent || (hasActions(data) && data.actions.length > 1) || hasChassisAbilities

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
        {showContent && <ContentBlockRenderer content={contentBlocks!} fontSize={fontSize.sm} compact={compact} />}
        {schemaName === 'chassis' && getChassisAbilities(data) && (!hideActions || compact) && (
          <EntityChassisAbilitiesContent />
        )}
        {(!hideActions || compact) && <EntityActions />}
      </VStack>
    </Flex>
  )
}
