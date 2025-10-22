import { Box, VStack } from '@chakra-ui/react'
import NumericStepper from '../NumericStepper'

interface PilotResourceSteppersProps {
  maxHP: number
  currentDamage: number
  maxAP: number
  currentAP: number
  currentTP: number
  onDamageChange: (value: number) => void
  onAPChange: (value: number) => void
  onTPChange: (value: number) => void
  disabled?: boolean
}

export function PilotResourceSteppers({
  maxHP,
  currentDamage,
  maxAP,
  currentAP,
  currentTP,
  onDamageChange,
  onAPChange,
  onTPChange,
  disabled = false,
}: PilotResourceSteppersProps) {
  const currentHP = maxHP - currentDamage

  return (
    <Box
      bg="bg.builder.pilot"
      borderWidth="builder.border"
      borderColor="border.builder.pilot"
      borderRadius="3xl"
      p={6}
      shadow="lg"
    >
      <VStack alignItems="center" gap={2}>
        <NumericStepper
          label="HP"
          value={currentHP}
          onChange={(newHP) => onDamageChange(maxHP - newHP)}
          max={maxHP}
          min={0}
          disabled={disabled}
        />
        <NumericStepper
          label="AP"
          value={currentAP}
          onChange={onAPChange}
          max={maxAP}
          disabled={disabled}
        />
        <NumericStepper label="TP" value={currentTP} onChange={onTPChange} disabled={disabled} />
      </VStack>
    </Box>
  )
}
