import { Box, Flex } from '@chakra-ui/react'
import { Text } from '../base/Text'
import type { ReactNode } from 'react'

interface SheetDisplayProps {
  label?: string
  value?: string
  height?: string | number
  minHeight?: string | number
  borderColor?: string
  children?: ReactNode
  disabled?: boolean
  labelBgColor?: string
  compact?: boolean
}

export function SheetDisplay({
  label,
  value,
  height,
  minHeight = '20',
  borderColor = 'su.black',
  labelBgColor = 'su.black',
  children,
  compact = false,
  disabled = false,
}: SheetDisplayProps) {
  return (
    <Flex direction="column" w="full">
      {/* Label with pseudoheader styling */}
      {label && (
        <Flex alignItems="center" mb={compact ? -1 : -2} zIndex={1}>
          <Text
            variant="pseudoheader"
            fontSize={compact ? 'xs' : 'sm'}
            textTransform="uppercase"
            ml={compact ? 2 : 3}
            bg={labelBgColor}
          >
            {label}
          </Text>
        </Flex>
      )}

      {/* Display box with consistent border styling matching SheetTextarea */}
      <Box
        w="full"
        h={height}
        minH={compact ? '16' : minHeight}
        p={compact ? 2 : 3}
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="md"
        bg="su.white"
        color="su.black"
        whiteSpace="pre-wrap"
        fontSize={compact ? 'xs' : 'sm'}
        overflowY="auto"
        cursor={disabled ? 'not-allowed' : 'default'}
        pointerEvents={disabled ? 'none' : 'auto'}
      >
        {children || value}
      </Box>
    </Flex>
  )
}
