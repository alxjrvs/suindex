import { Box, Button, VStack } from '@chakra-ui/react'
import { Text } from './base/Text'

interface StatDisplayProps {
  label: string
  value: string | number
  labelId?: string
  disabled?: boolean
  onClick?: () => void
  bg?: string
  valueColor?: string
  borderColor?: string
}

export function StatDisplay({
  label,
  value,
  labelId,
  disabled,
  onClick,
  bg = 'su.white',
  valueColor = 'su.black',
  borderColor = 'su.black',
}: StatDisplayProps) {
  const WrapperComponent = onClick ? Button : Box
  const commonProps = {
    w: 16,
    h: 16,
    borderRadius: '2xl' as const,
    bg,
    borderWidth: '3px',
    borderColor,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    cursor: onClick && !disabled ? ('pointer' as const) : ('default' as const),
    opacity: disabled ? 0.3 : 1,
    pointerEvents: disabled ? ('none' as const) : ('auto' as const),
    transition: 'opacity 0.2s',
  }

  const buttonProps = onClick
    ? {
        ...commonProps,
        disabled,
        onClick,
        _hover: !disabled ? { opacity: 0.8 } : undefined,
      }
    : commonProps

  return (
    <VStack gap={0} alignItems="center">
      <Text
        textTransform={'uppercase'}
        mb={-2}
        fontSize="xs"
        alignSelf="center"
        variant="pseudoheader"
        zIndex={1}
        id={labelId}
        bg={disabled ? 'gray.600' : undefined}
        color={disabled ? 'gray.300' : undefined}
      >
        {label}
      </Text>
      <WrapperComponent {...buttonProps}>
        <Text fontSize="lg" fontWeight="bold" color={valueColor}>
          {value}
        </Text>
      </WrapperComponent>
    </VStack>
  )
}
