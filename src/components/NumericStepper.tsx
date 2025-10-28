import { HStack, VStack, IconButton } from '@chakra-ui/react'
import { useCallback, useMemo } from 'react'
import { StatDisplay } from './StatDisplay'

interface NumericStepperProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  flash?: boolean
}

export default function NumericStepper({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  disabled = false,
  flash = false,
}: NumericStepperProps) {
  const handleIncrement = useCallback(() => {
    if (max === undefined || value < max) {
      onChange(max !== undefined ? Math.min(value + step, max) : value + step)
    }
  }, [max, value, step, onChange])

  const handleDecrement = useCallback(() => {
    if (value > min) {
      onChange(Math.max(value - step, min))
    }
  }, [value, min, step, onChange])

  const displayValue = useMemo(
    () => (max !== undefined ? `${value}/${max}` : `${value}`),
    [value, max]
  )

  const labelId = useMemo(
    () => `stepper-label-${label.toLowerCase().replace(/\s+/g, '-')}`,
    [label]
  )

  return (
    <HStack gap={1} alignItems="flex-end" role="group" aria-labelledby={labelId}>
      <StatDisplay
        disabled={disabled}
        label={label}
        value={displayValue}
        labelId={labelId}
        flash={flash}
      />
      <VStack gap={1} pb={2.5}>
        <IconButton
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && value >= max)}
          size="xs"
          w={5}
          h={5}
          minW={5}
          minH={5}
          bg="bg.input"
          color="fg.input"
          fontSize="xs"
          fontWeight="bold"
          borderWidth="1px"
          borderColor="su.black"
          borderRadius="md"
          _hover={{ bg: 'bg.muted' }}
          _disabled={{
            opacity: 0.3,
            cursor: 'not-allowed',
            _hover: { bg: 'bg.input' },
          }}
          aria-label={`Increment ${label}`}
        >
          ▲
        </IconButton>
        <IconButton
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          size="xs"
          w={5}
          h={5}
          minW={5}
          minH={5}
          bg="bg.input"
          color="fg.input"
          fontSize="xs"
          fontWeight="bold"
          borderWidth="1px"
          borderColor="su.black"
          borderRadius="md"
          _hover={{ bg: 'bg.muted' }}
          _disabled={{
            opacity: 0.3,
            cursor: 'not-allowed',
            _hover: { bg: 'bg.input' },
          }}
          aria-label={`Decrement ${label}`}
        >
          ▼
        </IconButton>
      </VStack>
    </HStack>
  )
}
