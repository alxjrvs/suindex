import { Box, Button, VStack } from '@chakra-ui/react'
import { Text } from './base/Text'
import { useState, useEffect } from 'react'

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
  flash?: boolean // Trigger flash animation
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
  flash = false,
}: StatDisplayProps) {
  const [isFlashing, setIsFlashing] = useState(false)
  const WrapperComponent = onClick ? Button : Box

  useEffect(() => {
    if (!flash) return

    const startTimer = setTimeout(() => setIsFlashing(true), 0)
    const endTimer = setTimeout(() => setIsFlashing(false), 3000)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(endTimer)
    }
  }, [flash])

  const commonProps = {
    w: compact ? 10 : 16,
    h: compact ? 10 : 16,
    borderRadius: compact ? 'lg' : 'xl',
    bg,
    borderWidth: compact ? '1px' : '2px',
    borderColor,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    cursor: onClick && !disabled ? ('pointer' as const) : ('default' as const),
    opacity: disabled ? 0.3 : 1,
    pointerEvents: disabled ? ('none' as const) : ('auto' as const),
    transition: isFlashing ? 'all 3s ease-out' : 'opacity 0.2s',
    transform: isFlashing ? 'scale(1)' : 'scale(1)',
    animation: isFlashing ? 'growShrink 3s ease-out' : undefined,
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
      <style>
        {`
          @keyframes growShrink {
            0% { transform: scale(1); }
            10% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
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
