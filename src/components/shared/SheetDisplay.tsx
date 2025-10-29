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
}

export function SheetDisplay({
  label,
  value,
  height,
  minHeight = '20',
  borderColor = 'su.black',
  labelBgColor = 'su.black',
  children,
  disabled = false,
}: SheetDisplayProps) {
  return (
    <Flex direction="column" w="full">
      {/* Label with pseudoheader styling */}
      {label && (
        <Flex alignItems="center" mb={-2} zIndex={1}>
          <Text
            variant="pseudoheader"
            fontSize="sm"
            textTransform="uppercase"
            ml={3}
            bg={disabled ? 'gray.600' : labelBgColor}
            color={disabled ? 'gray.300' : undefined}
          >
            {label}
          </Text>
        </Flex>
      )}

      {/* Display box with consistent border styling matching SheetTextarea */}
      <Box
        w="full"
        h={height}
        minH={minHeight}
        p={3}
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="md"
        bg="su.white"
        color="su.black"
        whiteSpace="pre-wrap"
        fontSize="sm"
        overflowY="auto"
        opacity={disabled ? 0.5 : 1}
        cursor={disabled ? 'not-allowed' : 'default'}
      >
        {children || value}
      </Box>
    </Flex>
  )
}
