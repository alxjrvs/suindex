import { Grid } from '@chakra-ui/react'
import { ChassisSelector } from './ChassisSelector'
import { PatternSelector } from './PatternSelector'
import { QuirkInput } from './QuirkInput'
import { AppearanceInput } from './AppearanceInput'
import { SalvageUnionReference } from 'salvageunion-reference'
import { useHydratedMech } from '../../hooks/mech'
import { useChangeMechChassis } from '../../hooks/mech/useChangeMechChassis'
import { useChangeMechChassisPattern } from '../../hooks/mech/useChangeMechChassisPattern'

interface ChassisInputsProps {
  id: string
}

export function ChassisInputs({ id }: ChassisInputsProps) {
  const { mech, selectedChassis } = useHydratedMech(id)
  const onChassisChange = useChangeMechChassis(id)
  const onPatternChange = useChangeMechChassisPattern(id)
  const allChassis = SalvageUnionReference.Chassis.all()
  const chassisId = selectedChassis?.schema_ref_id ?? null
  const pattern = mech?.pattern ?? ''

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full" h="full" alignItems="center">
      <ChassisSelector chassisId={chassisId} allChassis={allChassis} onChange={onChassisChange} />
      <PatternSelector
        pattern={pattern}
        selectedChassis={selectedChassis}
        onChange={onPatternChange}
      />

      <QuirkInput id={id} disabled={!selectedChassis} />
      <AppearanceInput id={id} disabled={!selectedChassis} />
    </Grid>
  )
}
