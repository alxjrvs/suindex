import { Flex } from '@chakra-ui/react'
import { SheetDisplay } from '../../shared/SheetDisplay'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { useParseTraitReferences } from '../../../utils/parseTraitReferences'

interface ConditionalSheetInfoProps {
  /** Property name to check in data (for backwards compatibility) */
  propertyName: string
  /** Optional explicit value to display (takes precedence over propertyName) */
  value?: string
  /** Optional label */
  label?: string
  /** Optional label color */
  labelBgColor?: string
  /** Optional children to render */
  children?: React.ReactNode
}

/**
 * Wrapper component for conditional SheetDisplay rendering.
 * Can either extract value from entity data via propertyName, or use explicit value prop.
 */
export function ConditionalSheetInfo({
  propertyName,
  value: explicitValue,
  label,
  labelBgColor,
  children,
}: ConditionalSheetInfoProps) {
  const { data, spacing, compact } = useEntityDisplayContext()

  let displayValue: string | undefined
  if (explicitValue !== undefined) {
    displayValue = explicitValue
  } else {
    const extractedValue = data[propertyName as keyof typeof data]
    displayValue = typeof extractedValue === 'string' ? extractedValue : undefined
  }

  const parsedContent = useParseTraitReferences(displayValue)

  if (!displayValue) return null
  if (!(propertyName in data) && explicitValue === undefined) return null

  return (
    <Flex p={spacing.contentPadding}>
      <SheetDisplay compact={compact} label={label} labelColor={labelBgColor}>
        {children || parsedContent}
      </SheetDisplay>
    </Flex>
  )
}
