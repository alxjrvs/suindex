import { VStack, Box } from '@chakra-ui/react'
import { SheetDisplay } from '../../shared/SheetDisplay'
import type { EntityDisplaySubProps } from './types'
import { EntitySubheader } from './EntitySubheader'

export function EntityOptions({ data, compact }: EntityDisplaySubProps) {
  if (!('options' in data) || !data.options || data.options.length === 0) return null
  return (
    <VStack gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
      <EntitySubheader compact={compact} label="Options" />
      <Box
        css={{
          columnCount: 2,
          columnGap: '0.25rem',
          '& > *': {
            breakInside: 'avoid',
            marginBottom: '0.25rem',
          },
        }}
      >
        {data.options.map((option, optIndex) => {
          const label = typeof option === 'string' ? '' : option.label
          const value = typeof option === 'string' ? option : option.value
          return <SheetDisplay compact={compact} key={optIndex} label={label} value={value} />
        })}
      </Box>
    </VStack>
  )
}
