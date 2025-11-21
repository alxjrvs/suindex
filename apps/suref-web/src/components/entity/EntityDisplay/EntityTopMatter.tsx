import { Box } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { EntityActions } from './EntityActions'
import { EntityImage } from './EntityImage'
import {
  hasActions,
  getChassisAbilities,
  getAssetUrl,
  findActionByName,
  extractVisibleActions,
  filterActionsExcludingName,
} from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { ContentBlockRenderer } from './ContentBlockRenderer'
import { EntityChassisAbilitiesContent } from './EntityChassisAbilitiesContent'
import { getEntityDisplayName } from '@/components/entity/entityDisplayHelpers'

export function EntityTopMatter({
  hideActions,
  hideImage,
  children,
}: {
  hideActions: boolean
  hideImage?: boolean
  children?: ReactNode
}) {
  const { data, schemaName, spacing, fontSize, compact, title, imageWidth } =
    useEntityDisplayContext()

  // Determine which content to render
  let contentBlocks = 'content' in data ? data.content : undefined

  // Check if any action name matches the entity name - if so, use that action's content
  if (hasActions(data)) {
    // Get entity name - prefer title from context, fallback to data.name
    const entityName = getEntityDisplayName(data, title)

    // Find action with matching name
    const matchingAction = findActionByName(data, entityName)

    // Only replace entity content if action has content
    if (matchingAction && matchingAction.content && matchingAction.content.length > 0) {
      contentBlocks = matchingAction.content
    }
  }

  // Show content if entity has content blocks
  const showContent = contentBlocks && contentBlocks.length > 0

  const hasChassisAbilities = schemaName === 'chassis' && getChassisAbilities(data)

  // Check if entity has actions that will be displayed (after filtering)
  let hasDisplayableActions = false
  if (hasActions(data) && (!hideActions || compact)) {
    const actions = extractVisibleActions(data)
    if (actions && actions.length > 0) {
      const entityName = getEntityDisplayName(data, title)
      const actionsToDisplay = filterActionsExcludingName(actions, entityName)
      hasDisplayableActions = actionsToDisplay.length > 0
    }
  }

  // Check if we should render EntityTopMatter:
  // 1. Entity has content blocks, OR
  // 2. Entity has chassis abilities, OR
  // 3. Entity has an image URL (so images can render even without content), OR
  // 4. Entity has actions that will be displayed (so actions can render even without content)
  const hasContent =
    !!showContent || hasChassisAbilities || !!getAssetUrl(data) || hasDisplayableActions

  if (!hasContent) {
    return null
  }

  const hasChassisAbilitiesInTopMatter =
    schemaName === 'chassis' && getChassisAbilities(data) && !hideActions && !compact

  return (
    <>
      <Box p={spacing.contentPadding}>
        {!hideImage && <EntityImage customWidth={imageWidth} />}
        {showContent && (
          <ContentBlockRenderer content={contentBlocks!} fontSize={fontSize.sm} compact={compact} />
        )}
        {children}
      </Box>
      {hasChassisAbilitiesInTopMatter && <EntityChassisAbilitiesContent />}
      {(!hideActions || compact) && <EntityActions />}
    </>
  )
}
