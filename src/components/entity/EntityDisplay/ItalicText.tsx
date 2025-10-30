import { Text } from '../../base/Text'
type ItalicTextProps = {
  children: string
  compact: boolean
}

export function ItalicText({ children, compact }: ItalicTextProps) {
  return (
    <Text
      color="su.black"
      fontWeight="medium"
      lineHeight="relaxed"
      fontStyle="italic"
      wordBreak="break-word"
      overflowWrap="break-word"
      whiteSpace="normal"
      overflow="hidden"
      maxW="100%"
      fontSize={compact ? 'xs' : 'sm'}
    >
      {children}
    </Text>
  )
}
