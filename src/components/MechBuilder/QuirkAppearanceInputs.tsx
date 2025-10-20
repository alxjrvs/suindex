import { rollTable } from '@randsum/salvageunion'
import { DiceRollButton } from '../shared/DiceRollButton'

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Quirk</label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={quirk}
            onChange={(e) => onQuirkChange(e.target.value)}
            placeholder="Enter quirk..."
            disabled={disabled}
            className="flex-1 p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <DiceRollButton
            onClick={handleRollQuirk}
            disabled={disabled}
            ariaLabel="Roll for quirk"
            title="Roll on the Quirks table"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Appearance</label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={appearance}
            onChange={(e) => onAppearanceChange(e.target.value)}
            placeholder="Enter appearance..."
            disabled={disabled}
            className="flex-1 p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <DiceRollButton
            onClick={handleRollAppearance}
            disabled={disabled}
            ariaLabel="Roll for appearance"
            title="Roll on the Mech Appearance table"
          />
        </div>
      </div>
    </div>
  )
}
