import { VStack } from '@chakra-ui/react'
import NumericStepper from '../NumericStepper'
import { RoundedBox } from '../shared/RoundedBox'
import type { PilotLiveSheetState } from './types'

interface PilotResourceSteppersProps {
  maxHP: number
  currentDamage: number
  maxAP: number
  currentAP: number
  currentTP: number
  updateEntity: (updates: Partial<PilotLiveSheetState>) => void
  disabled?: boolean
}

export function PilotResourceSteppers({
  maxHP,
  currentDamage,
  maxAP,
  currentAP,
  currentTP,
  updateEntity,
  disabled = false,
}: PilotResourceSteppersProps) {
  const currentHP = maxHP - currentDamage

  return (
    <RoundedBox bg="bg.builder.pilot" disabled={disabled}>
      <VStack alignItems="center" justifyContent="space-between" h="full">
        <NumericStepper
          label="HP"
          value={currentHP}
          onChange={(newHP) => updateEntity({ current_damage: maxHP - newHP })}
          max={maxHP}
          min={0}
          disabled={disabled}
        />
        <NumericStepper
          label="AP"
          value={currentAP}
          onChange={(value) => updateEntity({ current_ap: value })}
          max={maxAP}
          disabled={disabled}
        />
        <NumericStepper
          label="TP"
          value={currentTP}
          onChange={(value) => updateEntity({ current_tp: value })}
          disabled={disabled}
        />
      </VStack>
    </RoundedBox>
  )
}
