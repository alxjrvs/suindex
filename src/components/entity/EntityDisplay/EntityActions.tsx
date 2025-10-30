import type { EntityDisplaySubProps } from './types'
import { EntityDisplay } from '../EntityDisplay'
import { VStack } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import { EntityChassisAbility } from './EntityChassisAbility'

export function EntityActions({ data, compact, schemaName }: EntityDisplaySubProps) {
  if (!('actions' in data) || !data.actions || data.actions.length === 0) return null
  const simple = schemaName === 'chassis' || schemaName === 'actions'

  const label = schemaName === 'chassis' ? 'Chassis Abilities' : 'Actions'

  return (
    <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
      <Text fontSize="xl" variant="pseudoheader">
        {label}
      </Text>
      {data.actions.map((action, index) => {
        if (simple) {
          return <EntityChassisAbility key={index} action={action} compact={compact} />
        }
        return <EntityDisplay compact key={index} data={action} schemaName="actions" />
      })}
    </VStack>
  )
}
