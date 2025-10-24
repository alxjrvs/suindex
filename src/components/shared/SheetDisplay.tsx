import { Box, Flex } from '@chakra-ui/react'
import { Text } from '../base/Text'
import type { ReactNode } from 'react'

interface SheetDisplayProps {
  label?: string
  value?: string
  height?: string | number
  minHeight?: string | number
  children?: ReactNode
}

export function SheetDisplay({
  label,
  value,
  height,
  minHeight = '20',
  children,
}: SheetDisplayProps) {
  return (
    <Flex direction="column" w="full">
      {/* Label with pseudoheader styling */}
      {label && (
        <Flex alignItems="center" mb={-2} zIndex={1}>
          <Text variant="pseudoheader" fontSize="sm" textTransform="uppercase" ml={3}>
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
        borderColor="su.black"
        borderRadius="2xl"
        bg="su.white"
        color="su.black"
        fontWeight="semibold"
        whiteSpace="pre-wrap"
        overflowY="auto"
      >
        {children || value}
      </Box>
    </Flex>
  )
}
