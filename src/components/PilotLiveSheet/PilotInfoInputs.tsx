import { useMemo } from 'react'
import { Box, Flex, Grid } from '@chakra-ui/react'
import { SheetInput } from '../shared/SheetInput'
import { SheetSelect } from '../shared/SheetSelect'
import { RoundedBox } from '../shared/RoundedBox'
import { rollTable } from '@randsum/salvageunion'
import type { SURefClass } from 'salvageunion-reference'
import type { AdvancedClassOption } from './types'

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
  allClasses: SURefClass[]
  availableAdvancedClasses: AdvancedClassOption[]
  disabled?: boolean
  onCallsignChange: (value: string) => void
  onMottoChange: (value: string) => void
  onMottoUsedChange: (value: boolean) => void
  onKeepsakeChange: (value: string) => void
  onKeepsakeUsedChange: (value: boolean) => void
  onBackgroundChange: (value: string) => void
  onBackgroundUsedChange: (value: boolean) => void
  onAppearanceChange: (value: string) => void
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
  allClasses,
  availableAdvancedClasses,
  disabled = false,
  onCallsignChange,
  onMottoChange,
  onMottoUsedChange,
  onKeepsakeChange,
  onKeepsakeUsedChange,
  onBackgroundChange,
  onBackgroundUsedChange,
  onAppearanceChange,
  onClassChange,
  onAdvancedClassChange,
}: PilotInfoInputsProps) {
  // Filter to only show basic (core) classes
  const basicClasses = useMemo(() => {
    return allClasses
      .filter((cls) => cls.type === 'core')
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [allClasses])
  const handleMottoRoll = () => {
    const {
      result: { label },
    } = rollTable('Motto')

    onMottoChange(label)
  }

  const handleKeepsakeRoll = () => {
    const {
      result: { label },
    } = rollTable('Keepsake')
    onKeepsakeChange(label)
  }

  const handleAppearanceRoll = () => {
    const {
      result: { label },
    } = rollTable('Pilot Appearance')
    onAppearanceChange(label)
  }

  return (
    <RoundedBox
      bg="bg.builder.pilot"
      borderColor="border.builder.pilot"
      w="full"
      disabled={disabled}
    >
      <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4} w="full" h="full">
        {/* Callsign */}
        <SheetInput
          label="Callsign"
          value={callsign}
          onChange={onCallsignChange}
          placeholder="Enter callsign"
          disabled={disabled}
        />

        {/* Motto */}
        <SheetInput
          label="Motto"
          value={motto}
          onChange={onMottoChange}
          placeholder="Enter motto"
          disabled={disabled}
          toggleChecked={mottoUsed}
          onToggleChange={onMottoUsedChange}
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
              {basicClasses.map((cls) => (
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
          onChange={onKeepsakeChange}
          placeholder="Enter keepsake"
          disabled={disabled}
          toggleChecked={keepsakeUsed}
          onToggleChange={onKeepsakeUsedChange}
          onDiceRoll={handleKeepsakeRoll}
          diceRollAriaLabel="Roll on the Keepsake table"
          diceRollTitle="Roll on the Keepsake table"
        />

        {/* Appearance */}
        <SheetInput
          label="Appearance"
          value={appearance}
          onChange={onAppearanceChange}
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
          onChange={onBackgroundChange}
          placeholder="Enter background"
          disabled={disabled}
          toggleChecked={backgroundUsed}
          onToggleChange={onBackgroundUsedChange}
        />
      </Grid>
    </RoundedBox>
  )
}
