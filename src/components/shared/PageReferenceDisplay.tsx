import { Flex } from '@chakra-ui/react'
import type { EntityDisplaySubProps } from '../entity/EntityDisplay/types'
import { getSchemaDisplayName } from '../entity/entityDisplayHelpers'
import { Text } from '../base/Text'

export function PageReferenceDisplay({ compact, data, schemaName }: EntityDisplaySubProps) {
  if (!('page' in data) || !data.page) return null
  const displayName = getSchemaDisplayName(schemaName)

  const fontWeightBold = compact ? 'semibold' : 'bold'
  const fontWeightSemibold = compact ? 'semibold' : 'semibold'
  return (
    <Flex
      p={compact ? 1 : 2}
      borderTopWidth="2px"
      borderTopColor="su.black"
      color="su.black"
      justifyContent="space-between"
      alignItems="center"
      w="full"
      gap={4}
    >
      {displayName && (
        <Text
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

      <Text
        as="span"
        mr={4}
        fontSize="xs"
        fontWeight={fontWeightSemibold}
        textTransform="uppercase"
      >
        {data.source}
      </Text>
      <Text as="span" fontSize="xs" fontWeight={fontWeightBold}>
        Page {data.page}
      </Text>
    </Flex>
  )
}
