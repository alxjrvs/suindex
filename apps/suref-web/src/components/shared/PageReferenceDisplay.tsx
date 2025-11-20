import { Flex } from '@chakra-ui/react'
import { getDisplayName } from 'salvageunion-reference'
import { Text } from '../base/Text'
import { useEntityDisplayContext } from '../entity/EntityDisplay/useEntityDisplayContext'

export function PageReferenceDisplay({ bg }: { bg?: string }) {
  const { data, schemaName, spacing, compact } = useEntityDisplayContext()
  if (!('page' in data) || !data.page) return null
  const displayName = getDisplayName(schemaName)

  const fontWeightBold = compact ? 'semibold' : 'bold'
  const fontWeightSemibold = 'semibold'
  return (
    <Flex
      p={spacing.contentPadding}
      color="su.black"
      justifyContent="space-between"
      alignItems="center"
      w="full"
      gap={4}
      bg={bg ?? 'transparent'}
    >
      {displayName && (
        <Text
          variant="pseudoheader"
          fontWeight={fontWeightBold}
          textTransform="uppercase"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          fontSize="xs"
          flex="0 1 auto"
          minW="0"
        >
          {displayName}
        </Text>
      )}

      <Flex>
        <Text
          variant="pseudoheader"
          as="span"
          mr={4}
          fontSize="xs"
          fontWeight={fontWeightSemibold}
          textTransform="uppercase"
        >
          {data.source}
        </Text>
        <Text variant="pseudoheader" as="span" fontSize="xs" fontWeight={fontWeightBold}>
          Page {data.page}
        </Text>
      </Flex>
    </Flex>
  )
}
