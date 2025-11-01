import { VStack } from '@chakra-ui/react'
import NumericStepper from '../NumericStepper'
import { RoundedBox } from '../shared/RoundedBox'
import { useHydratedPilot, useUpdatePilot } from '../../hooks/pilot'

interface PilotResourceSteppersProps {
  id: string
  disabled?: boolean
}

export function PilotResourceSteppers({ id, disabled = false }: PilotResourceSteppersProps) {
  const { pilot } = useHydratedPilot(id)
  const maxHP = pilot?.max_hp ?? 10
  const currentDamage = pilot?.current_damage ?? 0
  const maxAP = pilot?.max_ap ?? 5
  const currentAP = pilot?.current_ap ?? 5
  const currentTP = pilot?.current_tp ?? 0
  const updateEntity = useUpdatePilot()
  const currentHP = maxHP - currentDamage

  return (
    <RoundedBox bg="bg.builder.pilot" disabled={disabled}>
      <VStack alignItems="center" justifyContent="space-between" h="full">
        <NumericStepper
          label="HP"
          value={currentHP}
          onChange={(newHP) =>
            updateEntity.mutate({ id, updates: { current_damage: maxHP - newHP } })
          }
          max={maxHP}
          min={0}
          disabled={disabled}
        />
        <NumericStepper
          label="AP"
          value={currentAP}
          onChange={(newAP) => updateEntity.mutate({ id, updates: { current_ap: newAP } })}
          max={maxAP}
          disabled={disabled}
        />
        <NumericStepper
          label="TP"
          value={currentTP}
          onChange={(newTP) => updateEntity.mutate({ id, updates: { current_tp: newTP } })}
          disabled={disabled}
        />
      </VStack>
    </RoundedBox>
  )
}
