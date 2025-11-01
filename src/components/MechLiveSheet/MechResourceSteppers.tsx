import { VStack } from '@chakra-ui/react'
import type { SURefChassis } from 'salvageunion-reference'
import NumericStepper from '../NumericStepper'
import { RoundedBox } from '../shared/RoundedBox'
import { useHydratedMech, useUpdateMech } from '../../hooks/mech'

interface MechResourceSteppersProps {
  id: string
  disabled?: boolean
}

export function MechResourceSteppers({ id, disabled = false }: MechResourceSteppersProps) {
  const { mech, selectedChassis } = useHydratedMech(id)
  const updateMech = useUpdateMech()
  const chassisRef = selectedChassis?.ref as SURefChassis | undefined
  const stats = chassisRef?.stats
  const maxSP = stats?.structurePts || 0
  const currentDamage = mech?.current_damage ?? 0
  const currentEP = mech?.current_ep ?? 0
  const currentHeat = mech?.current_heat ?? 0
  const currentSP = maxSP - currentDamage

  return (
    <RoundedBox bg="su.green" disabled={disabled}>
      <VStack alignItems="center" gap={2} h="full" justifyContent="space-between">
        <NumericStepper
          label="SP"
          value={currentSP}
          onChange={(newSP) =>
            updateMech.mutate({ id, updates: { current_damage: maxSP - newSP } })
          }
          max={maxSP}
          min={0}
          disabled={disabled}
        />
        <NumericStepper
          label="EP"
          value={currentEP}
          onChange={(newEP) => updateMech.mutate({ id, updates: { current_ep: newEP } })}
          max={stats?.energyPts || 0}
          disabled={disabled}
        />
        <NumericStepper
          label="HEAT"
          value={currentHeat}
          onChange={(newHeat) => updateMech.mutate({ id, updates: { current_heat: newHeat } })}
          max={stats?.heatCap || 0}
          disabled={disabled}
        />
      </VStack>
    </RoundedBox>
  )
}
