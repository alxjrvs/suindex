import { EntityDisplay } from '../EntityDisplay'
import { VStack } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import { hasActions, extractActions } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityActions() {
  const { data, schemaName, spacing } = useEntityDisplayContext()
  if (!hasActions(data)) return null

  const actions = extractActions(data)
  if (!actions || actions.length === 0) return null

  const label = schemaName === 'chassis' ? 'Chassis Abilities' : 'Actions'

  return (
    <VStack gap={spacing.smallGap} alignItems="stretch" borderRadius="md">
      <Text fontSize="xl" variant="pseudoheader">
        {label}
      </Text>
      {actions.map((action, index) => {
        return <EntityDisplay compact key={index} data={action} schemaName="actions" />
      })}
    </VStack>
  )
}
