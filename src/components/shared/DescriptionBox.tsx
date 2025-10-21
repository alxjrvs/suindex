import { Box, Text } from '@chakra-ui/react'

interface DescriptionBoxProps {
  description: string
}

export function DescriptionBox({ description }: DescriptionBoxProps) {
  return (
    <Box mb={4} p={3} borderWidth="2px" borderColor="su.black" bg="su.white">
      <Text color="su.black">{description}</Text>
    </Box>
  )
}
