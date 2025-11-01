import { useMemo } from 'react'
import { Box, Flex, Grid } from '@chakra-ui/react'
import { SheetInput } from '../shared/SheetInput'
import { SheetSelect } from '../shared/SheetSelect'
import { RoundedBox } from '../shared/RoundedBox'
import { rollTable } from '@randsum/salvageunion'
import { SalvageUnionReference, type SURefAbility } from 'salvageunion-reference'
import { useChangePilotClass } from '../../hooks/pilot/useChangePilotClass'
import { useChangePilotAdvancedClass } from '../../hooks/pilot/useChangePilotAdvancedClass'
import { useHydratedPilot, useUpdatePilot } from '../../hooks/pilot'

interface PilotInfoInputsProps {
  disabled?: boolean
  id: string
}

export function PilotInfoInputs({ id, disabled = false }: PilotInfoInputsProps) {
  const { pilot, abilities, selectedClass, selectedAdvancedClass } = useHydratedPilot(id)
  const onClassChange = useChangePilotClass(id)
  const onAdvancedClassChange = useChangePilotAdvancedClass(id)
  const updatePilot = useUpdatePilot()
  const motto = pilot?.motto ?? ''
  const mottoUsed = pilot?.motto_used ?? false
  const keepsake = pilot?.keepsake ?? ''
  const keepsakeUsed = pilot?.keepsake_used ?? false
  const background = pilot?.background ?? ''
  const backgroundUsed = pilot?.background_used ?? false
  const appearance = pilot?.appearance ?? ''
  const callsign = pilot?.callsign ?? ''
  const classId = selectedClass?.schema_ref_id ?? null
  const advancedClassId = selectedAdvancedClass?.schema_ref_id ?? null
  const allAdvancedClasses = useMemo(() => SalvageUnionReference.AdvancedClasses.all(), [])
  const allHybridClasses = useMemo(() => SalvageUnionReference.HybridClasses.all(), [])
  const allCoreClasses = useMemo(() => SalvageUnionReference.CoreClasses.all(), [])
  const sortedCoreClasses = useMemo(() => {
    return [...allCoreClasses].sort((a, b) => a.name.localeCompare(b.name))
  }, [allCoreClasses])

  const availableAdvancedClasses = useMemo(() => {
    // Early exit conditions
    if (abilities.length < 6) {
      return []
    }

    if (
      selectedClass?.ref &&
      'advanceable' in selectedClass.ref &&
      selectedClass.ref.advanceable === false
    ) {
      return []
    }

    // Count abilities by tree
    const abilitiesByTree: Record<string, number> = {}
    abilities.forEach((entity) => {
      const ability = entity.ref as SURefAbility
      const tree = ability.tree
      abilitiesByTree[tree] = (abilitiesByTree[tree] || 0) + 1
    })

    // Map advanced classes to AdvancedClassOption
    const available = allAdvancedClasses.map((advClass) => ({
      id: advClass.id,
      name: advClass.name,
      isAdvancedVersion: true,
    }))

    // Map hybrid classes to AdvancedClassOption
    const availableHybrid = allHybridClasses.map((hybridClass) => ({
      id: hybridClass.id,
      name: hybridClass.name,
      isAdvancedVersion: false,
    }))

    return [...available, ...availableHybrid]
  }, [abilities, selectedClass, allAdvancedClasses, allHybridClasses])

  const handleMottoRoll = async () => {
    const {
      result: { label },
    } = rollTable('Motto')

    await updatePilot.mutate({ id, updates: { motto: label } })
  }

  const handleKeepsakeRoll = async () => {
    const {
      result: { label },
    } = rollTable('Keepsake')
    await updatePilot.mutate({ id, updates: { keepsake: label } })
  }

  const handleAppearanceRoll = async () => {
    const {
      result: { label },
    } = rollTable('Pilot Appearance')
    await updatePilot.mutate({ id, updates: { appearance: label } })
  }

  return (
    <RoundedBox title="Pilot" bg="bg.builder.pilot" flex="1" minW="0" disabled={disabled}>
      <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4} w="full" h="full">
        {/* Callsign */}
        <SheetInput
          label="Callsign"
          value={callsign}
          onChange={(value) => updatePilot.mutate({ id, updates: { callsign: value } })}
          placeholder="Enter callsign"
          disabled={disabled}
        />

        <SheetInput
          label="Motto"
          value={motto}
          onChange={(value) => updatePilot.mutate({ id, updates: { motto: value } })}
          placeholder="Enter motto"
          disabled={disabled}
          toggleChecked={mottoUsed}
          onToggleChange={(value) => updatePilot.mutate({ id, updates: { motto_used: value } })}
          onDiceRoll={handleMottoRoll}
          diceRollAriaLabel="Roll on the Motto table"
          diceRollTitle="Roll on the Motto table"
        />

        {/* Class and Advanced Class - Together take same width as Callsign */}
        <Flex gap={4} h="full">
          {/* Class */}
          <Box flex="1" h="full">
            <SheetSelect
              label="Class"
              value={classId}
              onChange={onClassChange}
              placeholder="Select..."
            >
              {sortedCoreClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </SheetSelect>
          </Box>

          {/* Advanced Class */}
          <Box flex="1" h="full">
            <SheetSelect
              label="Advanced"
              value={advancedClassId}
              onChange={onAdvancedClassChange}
              disabled={disabled || availableAdvancedClasses.length === 0}
              placeholder="Select..."
            >
              {availableAdvancedClasses.map((option) => (
                <option key={`${option.id}-${option.isAdvancedVersion}`} value={option.id}>
                  {option.name}
                </option>
              ))}
            </SheetSelect>
          </Box>
        </Flex>

        {/* Keepsake */}
        <SheetInput
          label="Keepsake"
          value={keepsake}
          onChange={(value) => updatePilot.mutate({ id, updates: { keepsake: value } })}
          placeholder="Enter keepsake"
          disabled={disabled}
          toggleChecked={keepsakeUsed}
          onToggleChange={(value) => updatePilot.mutate({ id, updates: { keepsake_used: value } })}
          onDiceRoll={handleKeepsakeRoll}
          diceRollAriaLabel="Roll on the Keepsake table"
          diceRollTitle="Roll on the Keepsake table"
        />

        {/* Appearance */}
        <SheetInput
          label="Appearance"
          value={appearance}
          onChange={(value) => updatePilot.mutate({ id, updates: { appearance: value } })}
          placeholder="Enter appearance"
          disabled={disabled}
          onDiceRoll={handleAppearanceRoll}
          diceRollAriaLabel="Roll on the Pilot Appearance table"
          diceRollTitle="Roll on the Pilot Appearance table"
        />

        {/* Background */}
        <SheetInput
          label="Background"
          value={background}
          onChange={(value) => updatePilot.mutate({ id, updates: { background: value } })}
          placeholder="Enter background"
          disabled={disabled}
          toggleChecked={backgroundUsed}
          onToggleChange={(value) =>
            updatePilot.mutate({ id, updates: { background_used: value } })
          }
        />
      </Grid>
    </RoundedBox>
  )
}
