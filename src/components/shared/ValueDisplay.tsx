import { Box } from '@chakra-ui/react'
import { Text } from '../base/Text'

export function ValueDisplay({
  label,
  value,
  compact = false,
}: {
  label: string | number
  value?: string | number
  compact?: boolean
}) {
  const semiFontWeight = compact ? 'normal' : 'semibold'
  const fontSize = compact ? 'xs' : 'md'

  return (
    <Box display="inline-flex" gap={0}>
      <Text variant="pseudoheader" as="span" fontWeight={semiFontWeight} fontSize={fontSize}>
        {label}
      </Text>
      {value !== undefined && (
        <Text
          variant="pseudoheaderInverse"
          as="span"
          fontWeight={semiFontWeight}
          fontSize={fontSize}
        >
          {value}
        </Text>
      )}
    </Box>
  )
}
