import { Flex, Text, Box } from '@chakra-ui/react'
import { ActivationCostBox } from './ActivationCostBox'
import type { DataValue } from '../../types/common'

interface DetailsListProps {
  values: DataValue[]
  textColor?: string
  compact?: boolean
}

export function DetailsList({ values, textColor = 'su.black', compact = false }: DetailsListProps) {
  if (values.length === 0) return null

  const semiFontWeight = compact ? 'normal' : 'semibold'
  const boldFontWeight = compact ? 'semibold' : 'bold'
  const actualTextColor = compact ? 'su.black' : textColor

  return (
    <Flex display="inline-flex" flexWrap="wrap" gap={compact ? 1 : 2} alignItems="center">
      {values.map((item, index) => (
        <Flex key={index} display="inline-flex" alignItems="center" gap={compact ? 0.5 : 1}>
          {index > 0 && (
            <Text
              color={actualTextColor}
              fontWeight={semiFontWeight}
              fontSize={compact ? 'xs' : 'md'}
            >
              //
            </Text>
          )}
          {item.cost ? (
            <Box fontSize={compact ? '10px' : '12px'}>
              <ActivationCostBox cost={item.value} currency="" />
            </Box>
          ) : (
            <Text
              color={actualTextColor}
              fontWeight={boldFontWeight}
              fontSize={compact ? 'xs' : 'md'}
            >
              {String(item.value).includes(':') ? (
                <>
                  <Text as="span" fontWeight={semiFontWeight}>
                    {String(item.value).split(':')[0]}:
                  </Text>{' '}
                  <Text as="span" fontWeight={semiFontWeight}>
                    {String(item.value).split(':')[1]}
                  </Text>
                </>
              ) : (
                <Text as="span" fontWeight={semiFontWeight}>
                  {item.value}
                </Text>
              )}
            </Text>
          )}
        </Flex>
      ))}
    </Flex>
  )
}
