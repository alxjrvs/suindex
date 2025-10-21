import { Flex, Text, Box } from '@chakra-ui/react'
import type { DataValue } from '../../types/common'

interface DataListProps {
  values: DataValue[]
  textColor?: string
  invert?: boolean
}

export function DataList({ values, textColor = 'su.black', invert = false }: DataListProps) {
  if (values.length === 0) return null

  return (
    <Flex display="inline-flex" flexWrap="wrap" gap={2} alignItems="center">
      {values.map((item, index) => (
        <Flex key={index} display="inline-flex" alignItems="center" gap={1}>
          {index > 0 && (
            <Text color={textColor} opacity={0.5}>
              •
            </Text>
          )}
          {item.cost ? (
            <Flex display="inline-flex" alignItems="center" overflow="visible">
              <Flex
                bg="su.black"
                color="su.white"
                fontSize="12px"
                px="4px"
                py="2px"
                h="16px"
                fontWeight="bold"
                zIndex={2}
                alignItems="center"
                justifyContent="center"
              >
                {item.value}
              </Flex>
              <Box
                w={0}
                h={0}
                borderTop="8px solid transparent"
                borderBottom="8px solid transparent"
                borderLeft="8px solid"
                borderLeftColor="su.black"
                ml={0}
                zIndex={1}
              />
            </Flex>
          ) : (
            <Text color={textColor} opacity={invert ? 0.9 : 1}>
              {item.value}
            </Text>
          )}
        </Flex>
      ))}
    </Flex>
  )
}
