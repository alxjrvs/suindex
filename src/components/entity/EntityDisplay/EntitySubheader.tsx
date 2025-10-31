import { Text } from '../../base/Text'
export function EntitySubheader({
  disabled = false,
  compact,
  label,
}: {
  compact: boolean
  label: string
  disabled?: boolean
}) {
  return (
    <Text
      fontSize={compact ? 'md' : 'xl'}
      variant="pseudoheader"
      bg={disabled ? 'gray.600' : undefined}
      color={disabled ? 'gray.300' : undefined}
    >
      {label}
    </Text>
  )
}
