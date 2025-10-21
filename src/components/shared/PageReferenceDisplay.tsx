import { Box, Text } from '@chakra-ui/react'

interface PageReferenceDisplayProps {
  source: string
  page: number
}

export function PageReferenceDisplay({ source, page }: PageReferenceDisplayProps) {
  return (
    <Box
      mt={4}
      pt={3}
      borderTopWidth="2px"
      borderTopColor="su.black"
      fontSize="sm"
      color="su.black"
    >
      <Text as="span" fontWeight="bold" textTransform="uppercase">
        {source}
      </Text>{' '}
      • Page {page}
    </Box>
  )
}
