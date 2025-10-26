import { VStack } from '@chakra-ui/react'
import NumericStepper from '../NumericStepper'
import type { SURefChassis } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'

interface MechResourceSteppersProps {
  stats: SURefChassis['stats'] | undefined
  currentDamage: number
  currentEP: number
  currentHeat: number
  onDamageChange: (value: number) => void
  onEPChange: (value: number) => void
  onHeatChange: (value: number) => void
  disabled?: boolean
}

export function MechResourceSteppers({
  stats,
  currentDamage,
  currentEP,
  currentHeat,
  onDamageChange,
  onEPChange,
  onHeatChange,
  disabled = false,
}: MechResourceSteppersProps) {
  const maxSP = stats?.structurePts || 0
  const currentSP = maxSP - currentDamage

  return (
    <RoundedBox bg="su.green" disabled={disabled}>
      <VStack alignItems="center" gap={2} h="full" justifyContent="space-between">
        <NumericStepper
          label="SP"
          value={currentSP}
          onChange={(newSP) => onDamageChange(maxSP - newSP)}
          max={maxSP}
          min={0}
          disabled={disabled}
        />
        <NumericStepper
          label="EP"
          value={currentEP}
          onChange={onEPChange}
          max={stats?.energyPts || 0}
          disabled={disabled}
        />
        <NumericStepper
          label="HEAT"
          value={currentHeat}
          onChange={onHeatChange}
          max={stats?.heatCap || 0}
          disabled={disabled}
        />
      </VStack>
    </RoundedBox>
  )
}
