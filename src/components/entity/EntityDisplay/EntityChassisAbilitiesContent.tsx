import { VStack } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import { getChassisAbilities } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { NestedActionDisplay } from '../NestedActionDisplay'

export function EntityChassisAbilitiesContent() {
  const { data, spacing, compact, hideActions } = useEntityDisplayContext()

  const chassisAbilities = getChassisAbilities(data)
  if (!chassisAbilities || chassisAbilities.length === 0) return null

  return (
    <VStack gap={spacing.smallGap} alignItems="stretch">
      {!compact && (
        <Text fontSize="xl" variant="pseudoheader">
          Chassis Abilities
        </Text>
      )}
      {chassisAbilities.map((ability, index) => {
        return (
          <NestedActionDisplay
            compact={compact}
            key={index}
            data={ability}
            isLast={index === chassisAbilities.length - 1}
            hideContent={compact}
          />
        )
      })}
    </VStack>
  )
}
