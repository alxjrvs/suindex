import { Flex, Box } from '@chakra-ui/react'
import { SheetDisplay } from '../../shared/SheetDisplay'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { useParseTraitReferences } from '../../../utils/parseTraitReferences'

interface ConditionalSheetInfoProps {
  /** Property name to check in data (for backwards compatibility) */
  propertyName: string
  /** Optional explicit value to display (takes precedence over propertyName) */
  value?: string
  /** Optional label for the SheetDisplay */
  label?: string
  /** Optional label background color */
  labelBgColor?: string
  /** Optional border color */
  borderColor?: string
  /** Optional children to render inside SheetDisplay */
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
  borderColor,
  children,
}: ConditionalSheetInfoProps) {
  const { data, spacing, compact } = useEntityDisplayContext()

  // Use explicit value if provided, otherwise extract from data
  let displayValue: string | undefined
  if (explicitValue !== undefined) {
    displayValue = explicitValue
  } else {
    // Check if property exists and has a value
    if (!(propertyName in data) || !data[propertyName as keyof typeof data]) {
      return null
    }
    const extractedValue = data[propertyName as keyof typeof data]
    displayValue = typeof extractedValue === 'string' ? extractedValue : undefined
  }

  const entityName = 'name' in data ? data.name : 'unknown'
  console.log(
    `[ConditionalSheetInfo] Parsing trait references for entity="${entityName}", property="${propertyName}", value="${displayValue?.substring(0, 50)}..."`
  )

  // Parse trait references in the display value
  const parsedContent = useParseTraitReferences(displayValue)

  if (!displayValue) return null

  return (
    <Flex p={spacing.contentPadding}>
      <SheetDisplay
        compact={compact}
        label={label}
        labelBgColor={labelBgColor}
        borderColor={borderColor}
      >
        {children || (
          <Box lineHeight="relaxed" color="su.black">
            {parsedContent}
          </Box>
        )}
      </SheetDisplay>
    </Flex>
  )
}
