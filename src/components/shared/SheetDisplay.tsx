import { Box, Flex } from '@chakra-ui/react'
import { Text } from '../base/Text'
import type { ReactNode } from 'react'

interface SheetDisplayProps {
  label?: string
  value?: string
  height?: string | number
  minHeight?: string | number
  children?: ReactNode
  disabled?: boolean
}

export function SheetDisplay({
  label,
  value,
  height,
  minHeight = '20',
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
            bg={disabled ? 'gray.600' : undefined}
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
        borderWidth="3px"
        borderColor={disabled ? 'gray.600' : 'su.black'}
        borderRadius="2xl"
        bg={disabled ? 'gray.200' : 'su.white'}
        color={disabled ? 'gray.600' : 'su.black'}
        fontWeight="semibold"
        whiteSpace="pre-wrap"
        overflowY="auto"
      >
        {children || value}
      </Box>
    </Flex>
  )
}
