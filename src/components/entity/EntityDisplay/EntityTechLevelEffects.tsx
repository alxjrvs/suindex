import { VStack } from '@chakra-ui/react'
import { Heading } from '../../base/Heading'
import { SheetDisplay } from '../../shared/SheetDisplay'
import type { EntityDisplaySubProps } from './types'

export function EntityTechLevelEffects({ data, compact }: EntityDisplaySubProps) {
  const showTLE =
    'techLevelEffects' in data && data.techLevelEffects && data.techLevelEffects.length > 0
  if (!showTLE) return null

  return (
    <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
      <Heading
        level="h3"
        fontSize={compact ? 'md' : 'lg'}
        fontWeight="bold"
        color="su.black"
        textTransform="uppercase"
      >
        Abilities
      </Heading>
      {data.techLevelEffects.map((tle, index) => (
        <SheetDisplay key={index} label={`Tech Level ${tle.techLevelMin}`} value={tle.effect} />
      ))}
    </VStack>
  )
}
