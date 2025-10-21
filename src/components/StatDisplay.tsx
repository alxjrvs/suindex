import { Box, Text, VStack } from '@chakra-ui/react'

interface StatDisplayProps {
  label: string
  value: string | number
  labelId?: string
}

export function StatDisplay({ label, value, labelId }: StatDisplayProps) {
  return (
    <VStack gap={1}>
      <Text
        as="label"
        fontSize="xs"
        fontWeight="bold"
        color="#e8e5d8"
        id={labelId}
        textAlign="center"
      >
        {label}
      </Text>
      <Box
        w={16}
        h={16}
        borderRadius="2xl"
        bg="#e8e5d8"
        display="flex"
        alignItems="center"
        justifyContent="center"
        pt={0.5}
      >
        <Text fontSize="lg" fontWeight="bold" color="#2d3e36">
          {value}
        </Text>
      </Box>
    </VStack>
  )
}
