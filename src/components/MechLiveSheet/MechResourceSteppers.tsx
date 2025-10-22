import { VStack } from '@chakra-ui/react'
import NumericStepper from '../NumericStepper'
import type { Chassis } from 'salvageunion-reference'

interface MechResourceSteppersProps {
  stats: Chassis['stats'] | undefined
  currentDamage: number
  currentEP: number
  currentHeat: number
  onDamageChange: (value: number) => void
  onEPChange: (value: number) => void
  onHeatChange: (value: number) => void
}

export function MechResourceSteppers({
  stats,
  currentDamage,
  currentEP,
  currentHeat,
  onDamageChange,
  onEPChange,
  onHeatChange,
}: MechResourceSteppersProps) {
  const maxSP = stats?.structure_pts || 0
  const currentSP = maxSP - currentDamage

  return (
    <VStack alignItems="center" gap={2}>
      <NumericStepper
        label="SP"
        value={currentSP}
        onChange={(newSP) => onDamageChange(maxSP - newSP)}
        max={maxSP}
        min={0}
      />
      <NumericStepper
        label="EP"
        value={currentEP}
        onChange={onEPChange}
        max={stats?.energy_pts || 0}
      />
      <NumericStepper
        label="HEAT"
        value={currentHeat}
        onChange={onHeatChange}
        max={stats?.heat_cap || 0}
      />
    </VStack>
  )
}
