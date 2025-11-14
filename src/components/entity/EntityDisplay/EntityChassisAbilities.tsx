import { VStack } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import { getChassisAbilities } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { NestedActionDisplay } from '../NestedActionDisplay'

export function EntityChassisAbilities() {
  const { data, spacing, compact, schemaName } = useEntityDisplayContext()

  // Only render for chassis schema
  if (schemaName !== 'chassis') return null

  const chassisAbilities = getChassisAbilities(data)
  if (!chassisAbilities || chassisAbilities.length === 0) return null

  return (
    <VStack
      gap={spacing.smallGap}
      alignItems="stretch"
      borderRadius="md"
      p={spacing.contentPadding}
    >
      <Text fontSize="xl" variant="pseudoheader">
        Chassis Abilities
      </Text>
      {chassisAbilities.map((ability, index) => {
        return <NestedActionDisplay compact={compact} key={index} data={ability} />
      })}
    </VStack>
  )
}
