import { VStack } from '@chakra-ui/react'
import { SheetDisplay } from '../../shared/SheetDisplay'
import { EntitySubheader } from './EntitySubheader'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { useParseTraitReferences } from '../../../utils/parseTraitReferences'

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
          <TechLevelEffect
            key={`${index}-${effIdx}`}
            label={effect.label || `Tech Level ${tle.techLevelMin}`}
            value={effect.value}
            compact={compact}
          />
        ))
      )}
    </VStack>
  )
}

function TechLevelEffect({
  label,
  value,
  compact,
}: {
  label: string
  value: string
  compact: boolean
}) {
  const parsedValue = useParseTraitReferences(value)

  return <SheetDisplay compact={compact} label={label} children={parsedValue} />
}
