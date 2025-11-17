import { VStack } from '@chakra-ui/react'
import { hasActions, extractActions } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { NestedActionDisplay } from '../NestedActionDisplay'

export function EntityActions() {
  const { data, schemaName, spacing, compact } = useEntityDisplayContext()

  // Chassis now use chassisAbilities instead of actions
  if (schemaName === 'chassis') return null

  if (!hasActions(data)) return null

  const actions = extractActions(data)
  if (!actions || actions.length === 0) return null

  // Don't render nested action display for single-action entities
  // The action's content will be rendered in EntityTopMatter instead
  // In compact mode, only show nested action headers if there are multiple actions
  if (actions.length === 1) return null

  return (
    <VStack gap={spacing.smallGap} alignItems="stretch" borderRadius="md">
      {actions.map((action, index) => {
        return (
          <NestedActionDisplay
            compact={compact}
            key={index}
            data={action}
            isLast={index === actions.length - 1}
            hideContent={compact}
          />
        )
      })}
    </VStack>
  )
}
