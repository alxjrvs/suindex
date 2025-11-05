import { Flex } from '@chakra-ui/react'
import { getSchemaDisplayName } from '../entity/entityDisplayHelpers'
import { Text } from '../base/Text'
import { useEntityDisplayContext } from '../entity/EntityDisplay/useEntityDisplayContext'

export function PageReferenceDisplay({ bg }: { bg?: string }) {
  const { data, schemaName, spacing } = useEntityDisplayContext()
  if (!('page' in data) || !data.page) return null
  const displayName = getSchemaDisplayName(schemaName)

  const fontWeightBold = spacing.contentPadding === 1 ? 'semibold' : 'bold'
  const fontWeightSemibold = 'semibold'
  return (
    <Flex
      p={spacing.contentPadding}
      borderTopWidth="2px"
      borderTopColor="su.black"
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
