import { VStack } from '@chakra-ui/react'
import { SheetDisplay } from '../../shared/SheetDisplay'
import type { EntityDisplaySubProps } from './types'
import { EntitySubheader } from './EntitySubheader'

export function EntityTechLevelEffects({ data, compact }: EntityDisplaySubProps) {
  const showTLE =
    'techLevelEffects' in data && data.techLevelEffects && data.techLevelEffects.length > 0
  if (!showTLE) return null

  return (
    <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
      <EntitySubheader compact={compact} label="Abilities" />
      {data.techLevelEffects.map((tle, index) => (
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
