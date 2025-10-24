import { rollTable } from '@randsum/salvageunion'
import { FormInput } from '../shared/FormInput'

export function AppearanceInput({
  appearance,
  disabled,
  onAppearanceChange,
}: {
  appearance: string
  disabled: boolean
  onAppearanceChange: (value: string) => void
}) {
  const handleRollAppearance = () => {
    const result = rollTable('Mech Appearance')
    const appearanceText = result.result.description || result.result.label
    onAppearanceChange(appearanceText)
  }

  return (
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
  )
}
