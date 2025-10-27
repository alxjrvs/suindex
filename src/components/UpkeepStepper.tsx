import { HStack, VStack, IconButton } from '@chakra-ui/react'
import { useCallback, useMemo } from 'react'
import { StatDisplay } from './StatDisplay'
import { calculateScrapRemoval, hasEnoughScrap } from '../utils/scrapCalculations'

interface UpkeepStepperProps {
  label: string
  value: number
  onChange: (value: number, scrapUpdates?: Record<string, number>, affectedTLs?: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  techLevel: number
  scrapByTL: Record<number, number>
  flash?: boolean
}

export default function UpkeepStepper({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 5, // Upkeep increments by 5
  disabled = false,
  techLevel,
  scrapByTL,
  flash = false,
}: UpkeepStepperProps) {
  // Calculate upkeep cost in TL1 equivalent
  const upkeepCost = useMemo(() => {
    return step * techLevel // 5 * current tech level
  }, [step, techLevel])

  // Check if we have enough scrap to increment
  const canIncrement = useMemo(() => {
    if (max !== undefined && value >= max) return false
    return hasEnoughScrap(upkeepCost, scrapByTL)
  }, [upkeepCost, scrapByTL, value, max])

  const handleIncrement = useCallback(() => {
    if (!canIncrement) return

    // Calculate which scrap to remove
    const { updates, affectedTLs } = calculateScrapRemoval(upkeepCost, scrapByTL)

    // Call onChange with new value and scrap updates
    onChange(value + step, updates, affectedTLs)
  }, [canIncrement, upkeepCost, scrapByTL, value, step, onChange])

  const handleDecrement = useCallback(() => {
    if (value > min) {
      // Down button doesn't interact with scrap
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
          disabled={disabled || !canIncrement}
          size="xs"
          w={5}
          h={5}
          minW={5}
          minH={5}
          bg="bg.input"
          color="fg.input"
          fontSize="xs"
          fontWeight="bold"
          borderWidth="3px"
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
          borderWidth="3px"
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
