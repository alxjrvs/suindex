import { Box, Flex, Text } from '@chakra-ui/react'

interface PageReferenceDisplayProps {
  source?: string
  page: number
  schemaName?: string
}

export function PageReferenceDisplay({ source, page, schemaName }: PageReferenceDisplayProps) {
  return (
    <Flex
      pt={3}
      borderTopWidth="2px"
      borderTopColor="su.black"
      fontSize="sm"
      color="su.black"
      justifyContent="space-between"
      alignItems="center"
      w="full"
      gap={4}
    >
      {/* Left side - Schema name */}
      {schemaName && (
        <Text
          fontWeight="bold"
          textTransform="uppercase"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          fontSize="xs"
          flex="0 1 auto"
          minW="0"
        >
          {schemaName}
        </Text>
      )}

      {/* Right side - Source and page */}
      <Box ml="auto" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" flex="0 1 auto">
        {source && (
          <Text as="span" mr={4} fontSize="xs" fontWeight="semibold" textTransform="uppercase">
            {source}
          </Text>
        )}
        <Text as="span" fontSize="xs" fontWeight="bold">
          Page {page}
        </Text>
      </Box>
    </Flex>
  )
}
