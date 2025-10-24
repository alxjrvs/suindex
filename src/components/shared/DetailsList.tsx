import { Flex, Text, Box } from '@chakra-ui/react'
import { ActivationCostBox } from './ActivationCostBox'
import type { DataValue } from '../../types/common'

interface DetailsListProps {
  values: DataValue[]
  textColor?: string
}

export function DetailsList({ values, textColor = 'su.black' }: DetailsListProps) {
  if (values.length === 0) return null

  return (
    <Flex display="inline-flex" flexWrap="wrap" gap={2} alignItems="center">
      {values.map((item, index) => (
        <Flex key={index} display="inline-flex" alignItems="center" gap={1}>
          {index > 0 && (
            <Text color={textColor} fontWeight="semibold">
              //
            </Text>
          )}
          {item.cost ? (
            <Box fontSize="12px">
              <ActivationCostBox cost={item.value} currency="" />
            </Box>
          ) : (
            <Text color={textColor} fontWeight="bold">
              {item.value}
            </Text>
          )}
        </Flex>
      ))}
    </Flex>
  )
}
