import { rollTable } from '@randsum/salvageunion'
import { SheetInput } from '../shared/SheetInput'
import type { MechLiveSheetState } from './types'

export function QuirkInput({
  quirk,
  disabled,
  updateEntity,
}: {
  quirk: string
  disabled: boolean
  updateEntity: (updates: Partial<MechLiveSheetState>) => void
}) {
  const handleRollQuirk = () => {
    const result = rollTable('Quirks')
    const quirkText = result.result.description || result.result.label
    updateEntity({ quirk: quirkText })
  }

  return (
    <SheetInput
      label="Quirk"
      value={quirk}
      onChange={(value) => updateEntity({ quirk: value })}
      placeholder="Enter quirk..."
      disabled={disabled}
      onDiceRoll={handleRollQuirk}
      diceRollAriaLabel="Roll for quirk"
      diceRollTitle="Roll on the Quirks table"
    />
  )
}
