import { SheetTextarea } from './SheetTextarea'
import { RoundedBox } from './RoundedBox'

interface NotesProps {
  notes: string
  onChange: (value: string) => void
  disabled?: boolean
  backgroundColor?: string
  borderWidth?: 4 | 8
  placeholder?: string
  h?: string | number
}

export function Notes({
  notes,
  onChange,
  placeholder,
  disabled = false,
  backgroundColor = 'bg.builder',
  h,
}: NotesProps) {
  return (
    <RoundedBox title="notes" bg={backgroundColor} disabled={disabled} h={h ?? 'full'}>
      <SheetTextarea
        value={notes}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        height="full"
      />
    </RoundedBox>
  )
}
