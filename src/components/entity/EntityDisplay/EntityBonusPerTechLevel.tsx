import { VStack } from '@chakra-ui/react'
import { SheetDisplay } from '../../shared/SheetDisplay'
import type { EntityDisplaySubProps } from './types'
import { EntitySubheader } from './EntitySubheader'

export function EntityBonusPerTechLevel({ data, compact }: EntityDisplaySubProps) {
  const showBPTL =
    'bonusPerTechLevel' in data && data.bonusPerTechLevel && data.bonusPerTechLevel.length > 0

  if (!showBPTL) return null

  return (
    <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
      <EntitySubheader compact={compact} label="Abilities" />
      {data.bonusPerTechLevel.map((tle, index) => (
        <SheetDisplay
          compact={compact}
          key={index}
          label={`Tech Level ${tle.techLevelMin}`}
          value={tle.effect}
        />
      ))}
    </VStack>
  )
}
