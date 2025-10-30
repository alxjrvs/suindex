import { VStack, Grid } from '@chakra-ui/react'
import { Heading } from '../../base/Heading'
import { SheetDisplay } from '../../shared/SheetDisplay'
import type { EntityDisplaySubProps } from './types'

export function EntityOptions({ data, compact }: EntityDisplaySubProps) {
  if (!('options' in data) || !data.options || data.options.length === 0) return null
  return (
    <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
      <Heading level="h3" fontSize={compact ? 'md' : 'lg'} fontWeight="bold" color="su.brick">
        Options
      </Heading>
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
