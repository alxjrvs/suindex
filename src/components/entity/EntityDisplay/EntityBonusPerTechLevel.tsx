import { VStack } from '@chakra-ui/react'
import type { EntityDisplaySubProps } from './types'
import { EntityStats } from './EntityStats'

export function EntityBonusPerTechLevel({ data, compact, schemaName }: EntityDisplaySubProps) {
  const showBPTL = 'bonusPerTechLevel' in data && data.bonusPerTechLevel && data.bonusPerTechLevel

  if (!showBPTL) return null

  return (
    <VStack p={compact ? 1 : 2} gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
      {data.bonusPerTechLevel && (
        <EntityStats
          label="Bonus Per Tech Level"
          prefix="+"
          data={data.bonusPerTechLevel}
          compact={compact}
          schemaName={schemaName}
        />
      )}
    </VStack>
  )
}
