import { Text } from '../../base/Text'
export function EntitySubheader({ compact, label }: { compact: boolean; label: string }) {
  return (
    <Text fontSize={compact ? 'md' : 'xl'} variant="pseudoheader">
      {label}
    </Text>
  )
}
