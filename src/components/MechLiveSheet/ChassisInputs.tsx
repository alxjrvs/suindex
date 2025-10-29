import { Grid } from '@chakra-ui/react'
import { ChassisSelector } from './ChassisSelector'
import { PatternSelector } from './PatternSelector'
import { QuirkInput } from './QuirkInput'
import { AppearanceInput } from './AppearanceInput'
import type { SURefChassis } from 'salvageunion-reference'
import type { MechLiveSheetState } from './types'

interface ChassisInputsProps {
  chassisId: string | null
  pattern: string
  quirk: string
  appearance: string
  allChassis: SURefChassis[]
  selectedChassis: SURefChassis | undefined
  onChassisChange: (chassisId: string | null) => void
  onPatternChange: (pattern: string) => void
  updateEntity: (updates: Partial<MechLiveSheetState>) => void
}

export function ChassisInputs({
  chassisId,
  pattern,
  quirk,
  appearance,
  allChassis,
  selectedChassis,
  onChassisChange,
  onPatternChange,
  updateEntity,
}: ChassisInputsProps) {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full" h="full" alignItems="center">
      <ChassisSelector chassisId={chassisId} allChassis={allChassis} onChange={onChassisChange} />
      <PatternSelector
        pattern={pattern}
        selectedChassis={selectedChassis}
        onChange={onPatternChange}
      />

      <QuirkInput quirk={quirk} disabled={!selectedChassis} updateEntity={updateEntity} />
      <AppearanceInput
        appearance={appearance}
        disabled={!selectedChassis}
        updateEntity={updateEntity}
      />
    </Grid>
  )
}
