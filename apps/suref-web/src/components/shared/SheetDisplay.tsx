import { Box } from '@chakra-ui/react'
import { Text } from '@/components/base/Text'
import type { ReactNode } from 'react'

interface SheetDisplayProps {
  label?: string
  value?: string
  children?: ReactNode
  labelColor?: string
  compact?: boolean
}

export function SheetDisplay({
  label,
  value,
  children,
  labelColor = 'su.black',
  compact = false,
}: SheetDisplayProps) {
  const fontSize = compact ? 'sm' : 'md'

  return (
    <Box w="full">
      {label && (
        <Text
          fontSize={compact ? 'xs' : 'sm'}
          textTransform="uppercase"
          fontWeight="bold"
          color={labelColor}
          mb={1}
        >
          {label}
        </Text>
      )}
      <Box lineHeight="relaxed" color="su.black" fontWeight="normal" fontSize={fontSize}>
        {children || value}
      </Box>
    </Box>
  )
}
