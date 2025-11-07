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

  // Use explicit value if provided, otherwise extract from data
  let displayValue: string | undefined
  if (explicitValue !== undefined) {
    displayValue = explicitValue
  } else {
    // Extract from data if property exists
    const extractedValue = data[propertyName as keyof typeof data]
    displayValue = typeof extractedValue === 'string' ? extractedValue : undefined
  }

  const entityName = 'name' in data ? data.name : 'unknown'
  console.log(
    `[ConditionalSheetInfo] Parsing trait references for entity="${entityName}", property="${propertyName}", value="${displayValue?.substring(0, 50)}..."`
  )

  // Parse trait references in the display value (must be called before early returns)
  const parsedContent = useParseTraitReferences(displayValue)

  // Early returns after all hooks
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
