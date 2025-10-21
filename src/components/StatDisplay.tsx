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
        color="su.inputBg"
        id={labelId}
        textAlign="center"
      >
        {label}
      </Text>
      <Box
        w={16}
        h={16}
        borderRadius="2xl"
        bg="su.inputBg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        pt={0.5}
      >
        <Text fontSize="lg" fontWeight="bold" color="su.inputText">
          {value}
        </Text>
      </Box>
    </VStack>
  )
}
