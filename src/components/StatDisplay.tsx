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
  ariaLabel?: string
  compact?: boolean
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
  ariaLabel,
  compact = false,
}: StatDisplayProps) {
  const WrapperComponent = onClick ? Button : Box

  // All stat displays keep their background when disabled, just apply opacity
  const commonProps = {
    w: compact ? 10 : 16,
    h: compact ? 10 : 16,
    borderRadius: compact ? 'xl' : ('2xl' as const),
    bg,
    borderWidth: compact ? '2px' : '3px',
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
        bg: disabled ? 'gray.200' : bg,
        _hover: !disabled ? { opacity: 0.8 } : undefined,
        'aria-label': ariaLabel || String(value),
      }
    : commonProps

  return (
    <VStack gap={0} alignItems="center">
      <Text
        textTransform={'uppercase'}
        mb={compact ? -1.5 : -2}
        fontSize={compact ? '2xs' : 'xs'}
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
        <Text
          fontSize={compact ? 'sm' : 'md'}
          fontWeight="bold"
          color={disabled ? 'su.black' : valueColor}
          textAlign="center"
          overflow="hidden"
          whiteSpace="nowrap"
          maxW="full"
          w="full"
          css={{
            fontSize: compact ? 'clamp(0.4rem, 4.5cqw, 0.875rem)' : 'clamp(0.5rem, 4.5cqw, 1rem)',
            containerType: 'inline-size',
          }}
        >
          {value}
        </Text>
      </WrapperComponent>
    </VStack>
  )
}
