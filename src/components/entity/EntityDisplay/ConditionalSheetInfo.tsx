import { Flex } from '@chakra-ui/react'
import { SheetDisplay } from '../../shared/SheetDisplay'
import { useEntityDisplayContext } from './useEntityDisplayContext'

interface ConditionalSheetInfoProps {
  /** Property name to check in data */
  propertyName: string
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
 * Checks if a property exists in entity data and renders SheetDisplay with consistent padding.
 */
export function ConditionalSheetInfo({
  propertyName,
  label,
  labelBgColor,
  borderColor,
  children,
}: ConditionalSheetInfoProps) {
  const { data, spacing, compact } = useEntityDisplayContext()

  // Check if property exists and has a value
  if (!(propertyName in data) || !data[propertyName as keyof typeof data]) {
    return null
  }

  const value = data[propertyName as keyof typeof data]

  return (
    <Flex p={spacing.contentPadding}>
      <SheetDisplay
        compact={compact}
        value={typeof value === 'string' ? value : undefined}
        label={label}
        labelBgColor={labelBgColor}
        borderColor={borderColor}
      >
        {children}
      </SheetDisplay>
    </Flex>
  )
}
