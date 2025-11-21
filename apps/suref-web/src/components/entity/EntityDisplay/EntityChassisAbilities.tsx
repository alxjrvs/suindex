import { VStack } from '@chakra-ui/react'
import { Text } from '@/components/base/Text'
import { getChassisAbilities } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { NestedChassisAbility } from '@/components/entity/NestedChassisAbility'

export function EntityChassisAbilities() {
  const { data, spacing, compact, schemaName } = useEntityDisplayContext()

  // Only render for chassis schema
  if (schemaName !== 'chassis') return null

  const chassisAbilities = getChassisAbilities(data)
  if (!chassisAbilities || chassisAbilities.length === 0) return null

  // Get chassis name from data
  const chassisName = 'name' in data ? data.name : undefined

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
      {chassisAbilities.map((ability) => {
        return (
          <NestedChassisAbility
            compact={compact}
            key={ability.id}
            data={ability}
            chassisName={chassisName}
          />
        )
      })}
    </VStack>
  )
}
