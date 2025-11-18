import { Flex, VStack } from '@chakra-ui/react'
import { EntityActions } from './EntityActions'
import { EntityImage } from './EntityImage'
import { hasActions, extractVisibleActions, getChassisAbilities } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { ContentBlockRenderer } from './ContentBlockRenderer'
import { EntityChassisAbilitiesContent } from './EntityChassisAbilitiesContent'

export function EntityTopMatter({ hideActions }: { hideActions: boolean }) {
  const { data, schemaName, spacing, fontSize, compact } = useEntityDisplayContext()

  // Determine which content to render
  let contentBlocks = 'content' in data ? data.content : undefined

  // For single visible action entities, use the action's content instead
  const visibleActions = extractVisibleActions(data)
  const isSingleVisibleAction = hasActions(data) && visibleActions && visibleActions.length === 1
  if (isSingleVisibleAction) {
    if (visibleActions && visibleActions.length === 1) {
      contentBlocks = visibleActions[0].content
    }
  }

  // Show content if:
  // 1. Entity has content blocks, OR
  // 2. Entity has a single visible action (content extracted above)
  // Note: For abilities with single visible actions, we show the action content inline
  // For abilities with multiple visible actions, we show them as NestedActionDisplay (handled by EntityActions)
  const showContent = contentBlocks && contentBlocks.length > 0

  const hasChassisAbilities = schemaName === 'chassis' && getChassisAbilities(data)

  const hasContent =
    !!showContent || (visibleActions && visibleActions.length > 1) || hasChassisAbilities

  if (!hasContent) {
    return null
  }

  const hasChassisAbilitiesInTopMatter =
    schemaName === 'chassis' && getChassisAbilities(data) && !hideActions && !compact

  return (
    <Flex gap={spacing.smallGap} p={spacing.contentPadding} alignItems="flex-start" minH={!compact ? '200px' : undefined}>
      <EntityImage />
      <VStack
        justifyContent={!compact ? 'space-between' : undefined}
        flex="1"
        gap={spacing.contentPadding}
        alignItems="stretch"
        h={!compact ? 'full' : undefined}
        minW="0"
      >
        {showContent && (
          <ContentBlockRenderer content={contentBlocks!} fontSize={fontSize.sm} compact={compact} />
        )}
        {hasChassisAbilitiesInTopMatter && <EntityChassisAbilitiesContent />}
        {(!hideActions || compact) && <EntityActions />}
      </VStack>
    </Flex>
  )
}
