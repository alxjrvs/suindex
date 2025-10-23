import { rollTable } from '@randsum/salvageunion'
import { Grid } from '@chakra-ui/react'
import { FormInput } from '../shared/FormInput'

interface QuirkAppearanceInputsProps {
  quirk: string
  appearance: string
  disabled: boolean
  onQuirkChange: (value: string) => void
  onAppearanceChange: (value: string) => void
}

export function QuirkAppearanceInputs({
  quirk,
  appearance,
  disabled,
  onQuirkChange,
  onAppearanceChange,
}: QuirkAppearanceInputsProps) {
  const handleRollQuirk = () => {
    const result = rollTable('Quirks')
    const quirkText = result.result.description || result.result.label
    onQuirkChange(quirkText)
  }

  const handleRollAppearance = () => {
    const result = rollTable('Mech Appearance')
    const appearanceText = result.result.description || result.result.label
    onAppearanceChange(appearanceText)
  }

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} w="full">
      <FormInput
        label="Quirk"
        value={quirk}
        onChange={onQuirkChange}
        placeholder="Enter quirk..."
        disabled={disabled}
        onDiceRoll={handleRollQuirk}
        diceRollAriaLabel="Roll for quirk"
        diceRollTitle="Roll on the Quirks table"
      />

      <FormInput
        label="Appearance"
        value={appearance}
        onChange={onAppearanceChange}
        placeholder="Enter appearance..."
        disabled={disabled}
        onDiceRoll={handleRollAppearance}
        diceRollAriaLabel="Roll for appearance"
        diceRollTitle="Roll on the Mech Appearance table"
      />
    </Grid>
  )
}
