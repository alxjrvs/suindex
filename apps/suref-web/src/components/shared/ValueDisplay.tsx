import { Flex } from '@chakra-ui/react'
import { Text } from '@/components/base/Text'

export function ValueDisplay({
  label,
  value,
  compact = false,
  inverse = false,
  inline = true,
}: {
  label: string | number
  value?: string | number
  compact?: boolean
  inverse?: boolean
  /** Whether to display inline (default: true). Set to false for flex container contexts. */
  inline?: boolean
}) {
  const semiFontWeight = compact ? 'normal' : 'semibold'
  const fontSize = compact ? 'xs' : 'md'
  const mainVariant = inverse ? 'pseudoheaderInverse' : 'pseudoheader'
  const valueVariant = inverse ? 'pseudoheader' : 'pseudoheaderInverse'

  return (
    <Flex
      gap={0}
      cursor="default"
      whiteSpace="nowrap"
      border="1px solid black"
      display={inline ? 'inline-flex' : 'flex'}
      flexShrink={0}
      flexGrow={0}
      width="fit-content"
    >
      <Text
        variant={mainVariant}
        textTransform="uppercase"
        as="span"
        fontWeight={semiFontWeight}
        fontSize={fontSize}
      >
        {label}
      </Text>
      {value !== undefined && (
        <Text
          textTransform="uppercase"
          variant={valueVariant}
          as="span"
          fontWeight={semiFontWeight}
          fontSize={fontSize}
        >
          {value}
        </Text>
      )}
    </Flex>
  )
}
