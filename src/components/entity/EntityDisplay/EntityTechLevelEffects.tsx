import { VStack } from '@chakra-ui/react'
import { SheetDisplay } from '../../shared/SheetDisplay'
import { EntitySubheader } from './EntitySubheader'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityTechLevelEffects() {
  const { data, spacing, compact } = useEntityDisplayContext()
  const showTLE =
    'techLevelEffects' in data && data.techLevelEffects && data.techLevelEffects.length > 0

  if (!showTLE) return null

  return (
    <VStack
      p={spacing.contentPadding}
      gap={spacing.smallGap}
      alignItems="stretch"
      borderRadius="md"
    >
      <EntitySubheader label="Abilities" />
      {data.techLevelEffects.map((tle, index) =>
        tle.effects.map((effect, effIdx) => (
          <SheetDisplay
            compact={compact}
            key={`${index}-${effIdx}`}
            label={effect.label || `Tech Level ${tle.techLevelMin}`}
            value={effect.value}
          />
        ))
      )}
    </VStack>
  )
}
