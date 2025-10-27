import { useMemo } from 'react'
import { Box, Flex, Grid } from '@chakra-ui/react'
import { SheetInput } from '../shared/SheetInput'
import { SheetSelect } from '../shared/SheetSelect'
import { RoundedBox } from '../shared/RoundedBox'
import { rollTable } from '@randsum/salvageunion'
import type { SURefCoreClass } from 'salvageunion-reference'
import type { AdvancedClassOption, PilotLiveSheetState } from './types'

interface PilotInfoInputsProps {
  callsign: string
  motto: string
  mottoUsed: boolean
  keepsake: string
  keepsakeUsed: boolean
  background: string
  backgroundUsed: boolean
  appearance: string
  classId: string | null
  advancedClassId: string | null
  allCoreClasses: SURefCoreClass[]
  availableAdvancedClasses: AdvancedClassOption[]
  disabled?: boolean
  updateEntity: (updates: Partial<PilotLiveSheetState>) => void
  onClassChange: (classId: string | null) => void
  onAdvancedClassChange: (classId: string | null) => void
}

export function PilotInfoInputs({
  callsign,
  motto,
  mottoUsed,
  keepsake,
  keepsakeUsed,
  background,
  backgroundUsed,
  appearance,
  classId,
  advancedClassId,
  allCoreClasses,
  availableAdvancedClasses,
  disabled = false,
  updateEntity,
  onClassChange,
  onAdvancedClassChange,
}: PilotInfoInputsProps) {
  // Sort core classes alphabetically
  const sortedCoreClasses = useMemo(() => {
    return [...allCoreClasses].sort((a, b) => a.name.localeCompare(b.name))
  }, [allCoreClasses])
  const handleMottoRoll = () => {
    const {
      result: { label },
    } = rollTable('Motto')

    updateEntity({ motto: label })
  }

  const handleKeepsakeRoll = () => {
    const {
      result: { label },
    } = rollTable('Keepsake')
    updateEntity({ keepsake: label })
  }

  const handleAppearanceRoll = () => {
    const {
      result: { label },
    } = rollTable('Pilot Appearance')
    updateEntity({ appearance: label })
  }

  return (
    <RoundedBox title="Pilot" bg="bg.builder.pilot" w="full" disabled={disabled}>
      <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4} w="full" h="full">
        {/* Callsign */}
        <SheetInput
          label="Callsign"
          value={callsign}
          onChange={(value) => updateEntity({ callsign: value })}
          placeholder="Enter callsign"
          disabled={disabled}
        />

        {/* Motto */}
        <SheetInput
          label="Motto"
          value={motto}
          onChange={(value) => updateEntity({ motto: value })}
          placeholder="Enter motto"
          disabled={disabled}
          toggleChecked={mottoUsed}
          onToggleChange={(value) => updateEntity({ motto_used: value })}
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
              disabled={false}
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
          onChange={(value) => updateEntity({ keepsake: value })}
          placeholder="Enter keepsake"
          disabled={disabled}
          toggleChecked={keepsakeUsed}
          onToggleChange={(value) => updateEntity({ keepsake_used: value })}
          onDiceRoll={handleKeepsakeRoll}
          diceRollAriaLabel="Roll on the Keepsake table"
          diceRollTitle="Roll on the Keepsake table"
        />

        {/* Appearance */}
        <SheetInput
          label="Appearance"
          value={appearance}
          onChange={(value) => updateEntity({ appearance: value })}
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
          onChange={(value) => updateEntity({ background: value })}
          placeholder="Enter background"
          disabled={disabled}
          toggleChecked={backgroundUsed}
          onToggleChange={(value) => updateEntity({ background_used: value })}
        />
      </Grid>
    </RoundedBox>
  )
}
