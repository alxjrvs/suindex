import { Box, VStack, } from '@chakra-ui/react'
import { Text } from './base/Text'


interface StatDisplayProps {
  label: string
  value: string | number
  labelId?: string
}

export function StatDisplay({ label, value, labelId }: StatDisplayProps) {
  return (
    <VStack gap={0}>
      <Text
        fontSize="xs"
        variant="pseudoheader"
        zIndex={1}
        id={labelId}
        textAlign="center"
      >
        {label}
      </Text>
      <Box
        w={16}
        h={16}
        borderRadius="2xl"
        bg="su.white"
        borderWidth="3px"
        borderColor="su.black"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="lg" fontWeight="bold" color="su.black">
          {value}
        </Text>
      </Box>
    </VStack>
  )
}
