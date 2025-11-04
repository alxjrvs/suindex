import { VStack } from '@chakra-ui/react'
import { SheetDisplay } from '../../shared/SheetDisplay'
import type { EntityDisplaySubProps } from './types'
import { EntitySubheader } from './EntitySubheader'

export function EntityOptions({ data, compact }: EntityDisplaySubProps) {
  if (!('options' in data) || !data.options || data.options.length === 0) return null
  return (
    <VStack p={compact ? 1 : 2} gap={compact ? 2 : 3} alignItems="stretch" borderRadius="md">
      <EntitySubheader compact={compact} label="Options" />
      <VStack gap={compact ? 1 : 2} alignItems="stretch">
        {data.options.map((option, optIndex) => {
          const label = typeof option === 'string' ? '' : option.label
          const value = typeof option === 'string' ? option : option.value
          return <SheetDisplay compact={compact} key={optIndex} label={label} value={value} />
        })}
      </VStack>
    </VStack>
  )
}
