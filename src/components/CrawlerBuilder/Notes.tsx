interface NotesProps {
  notes: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function Notes({ notes, onChange, disabled = false }: NotesProps) {
  return (
    <div className="bg-[#c97d9e] border-4 border-[#c97d9e] rounded-2xl p-4 flex flex-col h-full">
      <h3 className="text-lg font-bold text-[#e8e5d8] uppercase mb-3">Notes</h3>

      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Add notes about your crawler..."
        className="w-full flex-1 p-3 border-0 rounded-lg bg-[#e8e5d8] text-[#2d3e36] font-semibold resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  )
}
