import { rollTable } from '@randsum/salvageunion'
import { SheetInput } from '../shared/SheetInput'
import type { MechLiveSheetState } from './types'

export function AppearanceInput({
  appearance,
  disabled,
  updateEntity,
}: {
  appearance: string
  disabled: boolean
  updateEntity: (updates: Partial<MechLiveSheetState>) => void
}) {
  const handleRollAppearance = () => {
    const result = rollTable('Mech Appearance')
    const appearanceText = result.result.description || result.result.label
    updateEntity({ appearance: appearanceText })
  }

  return (
    <SheetInput
      label="Appearance"
      value={appearance}
      onChange={(value) => updateEntity({ appearance: value })}
      placeholder="Enter appearance..."
      disabled={disabled}
      onDiceRoll={handleRollAppearance}
      diceRollAriaLabel="Roll for appearance"
      diceRollTitle="Roll on the Mech Appearance table"
    />
  )
}
