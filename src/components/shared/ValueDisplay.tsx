import { Flex } from '@chakra-ui/react'
import { Text } from '../base/Text'

export function ValueDisplay({
  label,
  value,
  compact = false,
  inverse = false,
}: {
  label: string | number
  value?: string | number
  compact?: boolean
  inverse?: boolean
}) {
  const semiFontWeight = compact ? 'normal' : 'semibold'
  const fontSize = compact ? 'xs' : 'md'
  const mainVariant = inverse ? 'pseudoheaderInverse' : 'pseudoheader'
  const valueVariant = inverse ? 'pseudoheader' : 'pseudoheaderInverse'

  return (
    <Flex gap={compact ? 0.5 : 1} cursor="default">
      <Text variant={mainVariant} as="span" fontWeight={semiFontWeight} fontSize={fontSize}>
        {label}
      </Text>
      {value !== undefined && (
        <Text variant={valueVariant} as="span" fontWeight={semiFontWeight} fontSize={fontSize}>
          {value}
        </Text>
      )}
    </Flex>
  )
}
