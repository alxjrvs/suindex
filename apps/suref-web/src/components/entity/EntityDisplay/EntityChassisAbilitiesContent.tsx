import { VStack } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import { getChassisAbilities } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { NestedChassisAbility } from '../NestedChassisAbility'

export function EntityChassisAbilitiesContent() {
  const { data, spacing, compact } = useEntityDisplayContext()

  const chassisAbilities = getChassisAbilities(data)
  if (!chassisAbilities || chassisAbilities.length === 0) return null

  return (
    <VStack gap={spacing.smallGap} alignItems="stretch">
      {chassisAbilities.map((ability, index) => {
        return (
          <NestedChassisAbility
            compact={compact}
            key={index}
            data={ability}
          />
        )
      })}
    </VStack>
  )
}
