import { Box, Button, VStack } from '@chakra-ui/react'
import { Text } from './base/Text'
import { useState, useEffect } from 'react'

interface StatDisplayProps {
  label: string
  value: number | string | undefined
  outOfMax?: number // When provided, displays "value/outOfMax"
  bottomLabel?: string // Optional label positioned below the value
  labelId?: string
  disabled?: boolean
  onClick?: () => void
  bg?: string
  valueColor?: string
  borderColor?: string
  ariaLabel?: string
  compact?: boolean
  flash?: boolean // Trigger flash animation
  inverse?: boolean
  isOverMax?: boolean // When true, shows green border
}

export function StatDisplay({
  label,
  value,
  outOfMax,
  bottomLabel,
  labelId,
  disabled,
  onClick,
  bg = 'su.white',
  valueColor = 'su.black',
  borderColor = 'su.black',
  ariaLabel,
  compact = false,
  flash = false,
  inverse = false,
  isOverMax = false,
}: StatDisplayProps) {
  const [isFlashing, setIsFlashing] = useState(false)
  const WrapperComponent = onClick ? Button : Box

  // Combine label and bottomLabel for aria-label
  const combinedAriaLabel = ariaLabel || (bottomLabel ? `${label} ${bottomLabel}` : label)
  const trueBg = inverse ? 'su.black' : bg
  const trueValueColor = inverse ? 'su.white' : valueColor
  const trueBorderColor = isOverMax ? 'su.green' : borderColor

  useEffect(() => {
    if (!flash) return

    const startTimer = setTimeout(() => setIsFlashing(true), 0)
    const endTimer = setTimeout(() => setIsFlashing(false), 3000)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(endTimer)
    }
  }, [flash])
  if (value === undefined) return null

  const commonProps = {
    w: compact ? 7 : 16,
    h: compact ? 7 : 16,
    borderRadius: 0,
    bg: trueBg,
    borderWidth: compact ? '1px' : '2px',
    borderColor: trueBorderColor,
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
        'aria-label': combinedAriaLabel,
        m: 0,
        p: 0,
      }
    : commonProps

  return (
    <VStack gap={0} alignItems="center" aria-label={combinedAriaLabel}>
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
        mb={compact ? -2 : -2}
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
          fontWeight="bold"
          color={disabled ? 'su.black' : trueValueColor}
          textAlign="center"
          overflow="hidden"
          whiteSpace="nowrap"
          maxW="full"
          w="full"
          css={{
            fontSize: compact ? 'clamp(0.3rem, 4.5cqw, 0.75rem)' : 'clamp(0.5rem, 4.5cqw, 1rem)',
            containerType: 'inline-size',
          }}
        >
          {outOfMax !== undefined ? `${value}/${outOfMax}` : value === 0 ? '-' : value}
        </Text>
      </WrapperComponent>
      <Text
        textTransform={'uppercase'}
        mt={compact ? -2 : -2}
        fontSize={compact ? '2xs' : 'xs'}
        alignSelf="center"
        variant="pseudoheader"
        zIndex={1}
        bg={disabled ? 'gray.600' : undefined}
        color={disabled ? 'gray.300' : undefined}
        visibility={bottomLabel ? 'visible' : 'hidden'}
      >
        {bottomLabel || '\u00A0'}
      </Text>
    </VStack>
  )
}
