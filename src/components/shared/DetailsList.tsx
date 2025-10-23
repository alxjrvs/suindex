import { Flex, Text, Box } from '@chakra-ui/react'
import { ActivationCostBox } from './ActivationCostBox'
import type { DataValue } from '../../types/common'

interface DetailsListProps {
  values: DataValue[]
  textColor?: string
  invert?: boolean
}

export function DetailsList({ values, textColor = 'su.black', invert = false }: DetailsListProps) {
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
            <Box fontSize="12px">
              <ActivationCostBox cost={item.value} currency="" />
            </Box>
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
