import { VStack } from '@chakra-ui/react'
import { SheetDisplay } from '../../shared/SheetDisplay'
import { EntitySubheader } from './EntitySubheader'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityOptions() {
  const { data, spacing, compact } = useEntityDisplayContext()
  if (!('options' in data) || !data.options || data.options.length === 0) return null
  return (
    <VStack
      p={spacing.contentPadding}
      gap={spacing.smallGap}
      alignItems="stretch"
      borderRadius="md"
    >
      <EntitySubheader label="Options" />
      <VStack gap={spacing.contentPadding} alignItems="stretch">
        {data.options.map((option, optIndex) => {
          const label = typeof option === 'string' ? '' : option.label
          const value = typeof option === 'string' ? option : option.value
          return <SheetDisplay compact={compact} key={optIndex} label={label} value={value} />
        })}
      </VStack>
    </VStack>
  )
}
