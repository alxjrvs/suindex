import { VStack } from '@chakra-ui/react'
import { hasActions, extractVisibleActions } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { NestedActionDisplay } from '../NestedActionDisplay'

export function EntityActions() {
  const { data, schemaName, spacing, compact, title } = useEntityDisplayContext()

  // Chassis now use chassisAbilities instead of actions
  if (schemaName === 'chassis') return null

  if (!hasActions(data)) return null

  const actions = extractVisibleActions(data)
  if (!actions || actions.length === 0) return null

  // Get entity name - prefer title from context, fallback to data.name
  const entityName = title || ('name' in data ? String(data.name) : '')

  // Filter out actions where the action name matches the entity name
  // Those actions have their content rendered in EntityTopMatter instead
  const actionsToDisplay = actions.filter((action) => action.name !== entityName)

  if (actionsToDisplay.length === 0) return null

  return (
    <VStack gap={spacing.smallGap} alignItems="stretch" borderRadius="md">
      {actionsToDisplay.map((action, index) => {
        return <NestedActionDisplay compact={compact} key={index} data={action} />
      })}
    </VStack>
  )
}
