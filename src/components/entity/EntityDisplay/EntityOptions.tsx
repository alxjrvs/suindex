import { VStack, Grid } from '@chakra-ui/react'
import { SheetDisplay } from '../../shared/SheetDisplay'
import type { EntityDisplaySubProps } from './types'
import { EntitySubheader } from './EntitySubheader'

export function EntityOptions({ data, compact }: EntityDisplaySubProps) {
  if (!('options' in data) || !data.options || data.options.length === 0) return null
  return (
    <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
      <EntitySubheader compact={compact} label="Options" />
      <Grid gridTemplateColumns="repeat(2, 1fr)" gridAutoFlow="dense" gap={1}>
        {data.options.map((option, optIndex) => {
          const label = typeof option === 'string' ? '' : option.label
          const value = typeof option === 'string' ? option : option.value
          return <SheetDisplay key={optIndex} label={label} value={value} />
        })}
      </Grid>
    </VStack>
  )
}
