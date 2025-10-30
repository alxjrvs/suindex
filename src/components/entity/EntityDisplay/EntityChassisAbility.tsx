import { VStack, Box } from '@chakra-ui/react'
import { SheetDisplay } from '../../shared/SheetDisplay'
import { Text } from '../../base/Text'
import type { SURefMetaAction } from 'salvageunion-reference'

export function EntityChassisAbility({
  action,
  disabled = false,
  compact = false,
}: {
  action: SURefMetaAction
  disabled?: boolean
  compact?: boolean
}) {
  const fontWeight = compact ? 'normal' : 'semibold'
  const fontSize = compact ? 'xs' : 'sm'
  return (
    <SheetDisplay compact={compact} label={action.name || undefined} disabled={disabled}>
      <Text lineHeight="relaxed">{action.effect}</Text>
      {'options' in action &&
        action.options &&
        Array.isArray(action.options) &&
        action.options.length > 0 && (
          <VStack mt={3} ml={4} gap={1} alignItems="stretch">
            {action.options.map((option, optIndex) => (
              <Box key={optIndex}>
                <Text fontWeight={fontWeight} as="span" fontSize={fontSize}>
                  {option.label}
                  {option.label.includes('•') || option.label.length === 0 ? '' : ':'}
                </Text>
                <Text fontWeight={fontWeight} as="span" fontSize={fontSize}>
                  {option.value}
                </Text>
              </Box>
            ))}
          </VStack>
        )}
    </SheetDisplay>
  )
}
