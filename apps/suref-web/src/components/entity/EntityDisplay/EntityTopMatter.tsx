import { Box } from '@chakra-ui/react'
import { EntityActions } from './EntityActions'
import { EntityImage } from './EntityImage'
import {
  hasActions,
  extractVisibleActions,
  getChassisAbilities,
  getAssetUrl,
} from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { ContentBlockRenderer } from './ContentBlockRenderer'
import { EntityChassisAbilitiesContent } from './EntityChassisAbilitiesContent'

export function EntityTopMatter({ hideActions }: { hideActions: boolean }) {
  const { data, schemaName, spacing, fontSize, compact, title } = useEntityDisplayContext()

  // Determine which content to render
  let contentBlocks = 'content' in data ? data.content : undefined

  // Check if any action name matches the entity name - if so, use that action's content
  const visibleActions = extractVisibleActions(data)
  if (hasActions(data) && visibleActions && visibleActions.length > 0) {
    // Get entity name - prefer title from context, fallback to data.name
    const entityName = title || ('name' in data ? String(data.name) : '')

    // Find action with matching name
    const matchingAction = visibleActions.find((action) => action.name === entityName)

    // Only replace entity content if action has content
    if (matchingAction && matchingAction.content && matchingAction.content.length > 0) {
      contentBlocks = matchingAction.content
    }
  }

  // Show content if entity has content blocks
  const showContent = contentBlocks && contentBlocks.length > 0

  const hasChassisAbilities = schemaName === 'chassis' && getChassisAbilities(data)

  // Check if we should render EntityTopMatter:
  // 1. Entity has content blocks, OR
  // 2. Entity has chassis abilities, OR
  // 3. Entity has an image URL (so images can render even without content)
  const hasContent = !!showContent || hasChassisAbilities || !!getAssetUrl(data)

  if (!hasContent) {
    return null
  }

  const hasChassisAbilitiesInTopMatter =
    schemaName === 'chassis' && getChassisAbilities(data) && !hideActions && !compact

  return (
    <>
      <Box p={spacing.contentPadding}>
        <EntityImage />
        {showContent && (
          <ContentBlockRenderer content={contentBlocks!} fontSize={fontSize.sm} compact={compact} />
        )}
      </Box>
      {hasChassisAbilitiesInTopMatter && <EntityChassisAbilitiesContent />}
      {(!hideActions || compact) && <EntityActions />}
    </>
  )
}
