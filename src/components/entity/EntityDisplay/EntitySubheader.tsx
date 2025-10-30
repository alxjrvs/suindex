import { Text } from '../../base/Text'
export function EntitySubheader({ compact, label }: { compact: boolean; label: string }) {
  if (compact) return null
  return (
    <Text fontSize="xl" variant="pseudoheader">
      {label}
    </Text>
  )
}
