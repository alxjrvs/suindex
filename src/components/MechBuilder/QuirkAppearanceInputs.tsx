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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Quirk</label>
        <input
          type="text"
          value={quirk}
          onChange={(e) => onQuirkChange(e.target.value)}
          placeholder="Enter quirk..."
          disabled={disabled}
          className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Appearance</label>
        <input
          type="text"
          value={appearance}
          onChange={(e) => onAppearanceChange(e.target.value)}
          placeholder="Enter appearance..."
          disabled={disabled}
          className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )
}
