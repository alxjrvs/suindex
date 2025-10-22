import { HStack, VStack, IconButton } from '@chakra-ui/react'
import { StatDisplay } from './StatDisplay'

interface NumericStepperProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

export default function NumericStepper({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  disabled = false,
}: NumericStepperProps) {
  const handleIncrement = () => {
    if (max === undefined || value < max) {
      onChange(max !== undefined ? Math.min(value + step, max) : value + step)
    }
  }

  const handleDecrement = () => {
    if (value > min) {
      onChange(Math.max(value - step, min))
    }
  }

  const displayValue = max !== undefined ? `${value}/${max}` : `${value}`
  const labelId = `stepper-label-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <HStack gap={1} alignItems="flex-end" role="group" aria-labelledby={labelId}>
      <StatDisplay label={label} value={displayValue} labelId={labelId} />
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
