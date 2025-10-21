interface NotesProps {
  notes: string
  onChange: (value: string) => void
  disabled?: boolean
  backgroundColor?: string // Default to green (#6b8e7f)
  borderWidth?: 4 | 8 // Default to 8
  placeholder?: string // Default to "Add notes..."
  height?: string // Default to 'h-96'
}

export function Notes({
  notes,
  onChange,
  disabled = false,
  backgroundColor = '#6b8e7f',
  borderWidth = 8,
  placeholder = 'Add notes...',
  height = 'h-96',
}: NotesProps) {
  const borderClass = borderWidth === 8 ? 'border-8' : 'border-4'
  const roundedClass = borderWidth === 8 ? 'rounded-3xl' : 'rounded-2xl'
  const paddingClass = borderWidth === 8 ? 'p-6' : 'p-4'
  const titleClass = borderWidth === 8 ? 'text-xl mb-4' : 'text-lg mb-3'
  const textareaRoundedClass = borderWidth === 8 ? 'rounded-2xl' : 'rounded-lg'
  const textareaPaddingClass = borderWidth === 8 ? 'p-4' : 'p-3'

  return (
    <div
      className={`${borderClass} ${roundedClass} ${paddingClass} shadow-lg`}
      style={{ backgroundColor, borderColor: backgroundColor }}
    >
      <h2 className={`${titleClass} font-bold text-[#e8e5d8] uppercase`}>Notes</h2>

      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full ${height} ${textareaPaddingClass} border-0 ${textareaRoundedClass} bg-[#e8e5d8] text-[#2d3e36] font-semibold resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
      />
    </div>
  )
}

