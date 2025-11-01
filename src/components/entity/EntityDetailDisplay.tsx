import { SalvageUnionReference, type SURefSchemaName } from 'salvageunion-reference'
import { Text } from '../base/Text'
import { EntityDisplayTooltip } from './EntityDisplayTooltip'
import { Box } from '@chakra-ui/react'

export function EntityDetailDisplay({
  label,
  value,
  schemaName,
  compact = false,
}: {
  value?: number | string
  label: number | string
  compact?: boolean
  schemaName: SURefSchemaName
}) {
  const semiFontWeight = compact ? 'normal' : 'semibold'
  const fontSize = compact ? 'xs' : 'md'

  // Find entity by name (case-insensitive) to get its ID for tooltip
  const entity = SalvageUnionReference.findIn(
    schemaName,
    (t) => t.name.toLowerCase() === String(label).toLowerCase()
  )
  const id = entity?.id

  const textContent = (
    <Box display="inline-flex" gap={0}>
      <Text variant="pseudoheader" as="span" fontWeight={semiFontWeight} fontSize={fontSize}>
        {label}
      </Text>
      {value !== undefined && (
        <Text
          variant="pseudoheaderInverse"
          as="span"
          fontWeight={semiFontWeight}
          fontSize={fontSize}
        >
          {value}
        </Text>
      )}
    </Box>
  )

  // If we found the trait ID, wrap with tooltip
  if (id) {
    return (
      <EntityDisplayTooltip schemaName={schemaName} entityId={id} openDelay={300}>
        {textContent}
      </EntityDisplayTooltip>
    )
  }

  // Otherwise just return the text
  return textContent
}
