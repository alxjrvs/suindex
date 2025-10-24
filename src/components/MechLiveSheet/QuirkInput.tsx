import { rollTable } from '@randsum/salvageunion'
import { SheetInput } from '../shared/SheetInput'

export function QuirkInput({
  quirk,
  disabled,
  onQuirkChange,
}: {
  quirk: string
  disabled: boolean
  onQuirkChange: (value: string) => void
}) {
  const handleRollQuirk = () => {
    const result = rollTable('Quirks')
    const quirkText = result.result.description || result.result.label
    onQuirkChange(quirkText)
  }

  return (
    <SheetInput
      label="Quirk"
      value={quirk}
      onChange={onQuirkChange}
      placeholder="Enter quirk..."
      disabled={disabled}
      onDiceRoll={handleRollQuirk}
      diceRollAriaLabel="Roll for quirk"
      diceRollTitle="Roll on the Quirks table"
    />
  )
}
