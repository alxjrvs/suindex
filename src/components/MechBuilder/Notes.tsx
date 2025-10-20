interface NotesProps {
  notes: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function Notes({ notes, onChange, disabled = false }: NotesProps) {
  return (
    <div className="bg-[#6b8e7f] border-8 border-[#6b8e7f] rounded-3xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-[#e8e5d8] uppercase mb-4">Notes</h2>

      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Add notes about your mech..."
        className="w-full h-96 p-4 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  )
}
